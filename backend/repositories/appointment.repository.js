import { Appointment } from "../models/appointment.model.js";
import { Establishment } from "../models/establishment.model.js";
import { Service } from "../models/service.model.js";
import { ServiceRepository } from "./service.repository.js";
import { ServiceAppointment } from "../models/associations/service.appointment.model.js";
import { BarberRepository } from "../repositories/barber.repository.js";
import { Barber } from "../models/barber.model.js";
import { Op, col } from "sequelize";
import { DAYS } from "../validators/schedule.validator.js";
import { ScheduleRepository } from "./schedule.repository.js";
import {
  setTimeToDate,
  formatDateForTimezone,
} from "../utils/appointment.utils.js";

const RETURN_ATTRS = [
  "id",
  "customer_name",
  "customer_phone",
  "customer_email",
  "appointment_datetime",
  "total_duration",
  "status",
  "barber_id",
  "image_finish_path",
  "establishment_id",
  [col("establishment.name"), "establishment_name"],
];

const availability_states = ["pending", "confirmed"];

export const AppointmentRepository = {
  async getAll({
    barberId = null,
    establishmentId = null,
    statusAppointment = null,
    from = null,
    to = null,
    sort = "ASC",
    offset = 0,
    limit = null,
  } = {}) {
    const where = {};
    if (barberId != null) where.barber_id = barberId;

    if (from || to) {
      where.appointment_datetime = {
        ...(from ? { [Op.gte]: formatDateForTimezone(from) } : {}),
        ...(to ? { [Op.lte]: formatDateForTimezone(to) } : {}),
      };
    }
    if (statusAppointment) where.status = statusAppointment;
    const order = [["appointment_datetime", sort]];
    const options = {
      where,
      order,
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "establishment",
          attributes: [],
          required: false,
        },
      ],
    };
    if (offset != null) options.offset = offset;
    if (limit != null) options.limit = limit;

    if (establishmentId != null) {
      options.include.push({
        model: Barber,
        as: "barber",
        where: { establishment_id: establishmentId },
        attributes: [],
      });
    }

    return Appointment.findAndCountAll(options);
  },

  async getById(id) {
    const appointment = await Appointment.findByPk(id, {
      attributes: [
        "id",
        "customer_name",
        "customer_phone",
        "customer_email",
        "appointment_datetime",
        "total_duration",
        "status",
        "barber_id",
        "image_finish_path",
        "establishment_id",
      ],
      include: [
        {
          model: Establishment,
          as: "establishment",
          attributes: ["id", "name"],
        },
        {
          model: ServiceAppointment,
          as: "service_appointments",
          attributes: ["service_id", "price"],
          include: [
            {
              model: Service,
              as: "service",
              attributes: ["id", "name", "description", "duration", "type"],
            },
          ],
        },
      ],
    });

    if (!appointment) return null;

    // Transform to include services with their appointment-specific prices
    const appointmentData = appointment.toJSON();
    appointmentData.services = appointmentData.service_appointments?.map(sa => ({
      id: sa.service.id,
      name: sa.service.name,
      description: sa.service.description,
      duration: sa.service.duration,
      type: sa.service.type,
      price: sa.price, // Price from the appointment relation
    })) || [];
    delete appointmentData.service_appointments;

    return appointmentData;
  },

  async create(appointment) {
    // TODO: Move business logic validations to service layer:
    // - Barber belongs to establishment validation
    // - Schedule/time availability validation
    // - Service validation and duration calculation
    // - Overlap checking
    // Repository should focus on data persistence only
    
    let sum_duration = 0;
    const barber = await BarberRepository.getById(appointment.barber_id);

    const targetEstablishmentId = appointment.establishment_id
      ? parseInt(appointment.establishment_id)
      : barber?.establishment_id;

    if (
      appointment.establishment_id &&
      barber.establishment_id !== parseInt(appointment.establishment_id)
    ) {
      throw new Error("Barber does not belong to the specified establishment");
    }

    const appointmentDateStr = formatDateForTimezone(
      appointment.appointment_datetime,
    );
    const appointmentDate = new Date(appointmentDateStr);

    const day_of_week = DAYS[appointmentDate.getDay()];

    const schedule = await ScheduleRepository.getByDay(day_of_week);

    if (!schedule.is_active) {
      throw new Error("The barbershop is closed on this day");
    }

    const scheduleStartDate = setTimeToDate(
      appointmentDate,
      schedule.start_time,
    );
    const scheduleEndDate = setTimeToDate(appointmentDate, schedule.end_time);

    if (
      appointmentDate < scheduleStartDate ||
      appointmentDate > scheduleEndDate
    ) {
      throw new Error(
        "The appointment time is outside of the allowed schedule",
      );
    }

    const services = [];

    if (appointment.services_ids && appointment.services_ids.length > 0) {
      for (const service_id of appointment.services_ids) {
        const service = await ServiceRepository.getById(service_id);

        // Validate service belongs to the target establishment
        if (targetEstablishmentId && service.Establishment_id !== targetEstablishmentId) {
          throw new Error(
            `Service "${service.name}" is not offered by this establishment`,
          );
        }

        sum_duration += service.duration;
        services.push(service);
      }
    }

    const totalDuration =
      appointment.total_duration != null
        ? appointment.total_duration
        : sum_duration;

    if (!totalDuration || totalDuration <= 0) {
      throw new Error("Total duration must be greater than zero");
    }

    const appointmentStart = appointmentDate.getTime();
    const appointmentEnd = appointmentStart + totalDuration * 60 * 1000;

    const existingAppointments = await this.getAvailabilityAppointments(
      appointment.barber_id,
      scheduleStartDate,
      scheduleEndDate,
    );

    const overlaps = existingAppointments.some((app) => {
      const start = new Date(app.appointment_datetime).getTime();
      // Convert duration (minutes) to milliseconds
      const end = start + app.total_duration * 60 * 1000;

      // Overlap if intervals intersect: [start,end) vs [appointmentStart, appointmentEnd)
      return appointmentStart < end && appointmentEnd > start;
    });

    if (overlaps) {
      throw new Error("Barber is not available at this time");
    }

    const newAppointment = await Appointment.create({
      customer_name: appointment.customer_name,
      customer_phone: appointment.customer_phone,
      customer_email: appointment.customer_email || null,
      appointment_datetime: appointmentDateStr,
      total_duration: totalDuration,
      status: appointment.status,
      barber_id: appointment.barber_id,
      establishment_id: targetEstablishmentId,
    });

    const services_ids = [];

    for (const service of services) {
      try {
        // Store the current service price in the appointment relation
        await ServiceAppointment.create({
          service_id: service.id,
          appointment_id: newAppointment.id,
          price: service.price, // Get price from Service model
        });
        services_ids.push(service);
      } catch (err) {
        console.error("Error linking service to appointment:", err.message);
      }
    }

    return {
      ...newAppointment.toJSON(),
      services: services_ids.map((service) => ({
        id: service.id,
        name: service.name,
      })),
    };
  },
  async update(id, appointment) {
    // TODO: Move business logic validations to service layer:
    // - Check if appointment exists
    // - Service validation and duration calculation
    // - Establishment validation
    // Repository should focus on data persistence only
    
    const existingAppointment = await Appointment.findByPk(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }

    const existingBarber = await BarberRepository.getById(
      existingAppointment.barber_id,
    );

    if (existingAppointment.barber_id != null && !existingBarber) {
      throw new Error("Barber not found");
    }

    if (appointment.services_ids && appointment.services_ids.length > 0) {
      let sum_duration = 0;
      const services = [];

      const targetEstablishmentId = appointment.establishment_id
        ? parseInt(appointment.establishment_id)
        : (existingAppointment.establishment_id ??
          existingBarber?.establishment_id);

      for (const service_id of appointment.services_ids) {
        const service = await ServiceRepository.getById(service_id);

        // Validate service belongs to the target establishment
        if (targetEstablishmentId && service.Establishment_id !== targetEstablishmentId) {
          throw new Error(
            `Service "${service.name}" is not offered by this establishment`,
          );
        }

        sum_duration += service.duration;
        services.push(service);
      }

      if (appointment.total_duration == null) {
        appointment.total_duration = sum_duration;
      }

      await ServiceAppointment.destroy({
        where: { appointment_id: id },
      });

      // Create new service associations with current prices
      for (const service of services) {
        await ServiceAppointment.create({
          service_id: service.id,
          appointment_id: id,
          price: service.price, // Get price from Service model
        });
      }
    }

    if (appointment.appointment_datetime) {
      appointment.appointment_datetime = formatDateForTimezone(
        appointment.appointment_datetime,
      );
    }

    await existingAppointment.update(appointment);

    // Return updated appointment with services
    return this.getById(id);
  },
  async delete(id) {
    const existingAppointment = await Appointment.findByPk(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
    await existingAppointment.destroy();
  },
  async getAvailabilityAppointments(
    barberId,
    from,
    to,
    establishmentId = null,
  ) {
    const fromFormatted = formatDateForTimezone(from);
    const toFormatted = formatDateForTimezone(to);

    const where = {};
    where.appointment_datetime = {
      [Op.gte]: fromFormatted,
      [Op.lte]: toFormatted,
    };
    if (barberId != null) where.barber_id = barberId;

    where.status = { [Op.in]: availability_states };

    const options = { where };

    if (establishmentId != null) {
      options.include = [
        {
          model: Barber,
          as: "barber",
          where: { establishment_id: establishmentId },
          attributes: [],
        },
      ];
    }

    return Appointment.findAll(options);
  },
};
