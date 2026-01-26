import { Appointment } from "../models/appointment.model.js";
import { ServiceRepository } from "./service.repository.js";
import { ServiceAppointment } from "../models/associations/service.appointment.model.js";
import { BarberRepository } from "../repositories/barber.repository.js";
import { Op } from "sequelize";
import { DAYS } from "../validators/schedule.validator.js";
import { ScheduleRepository } from "./schedule.repository.js";
import {
  setTimeToDate,
  formatDateForTimezone,
} from "../utils/appointment.utils.js";

const availability_states = ["pending", "confirmed"];

export const AppointmentRepository = {
  async getAll({
    barberId = null,
    statusAppointment = null,
    from = null,
    to = null,
    sort = "ASC",
    offset = 0,
    limit = 20,
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
    };
    if (offset != null) options.offset = offset;
    if (limit != null) options.limit = limit;

    return Appointment.findAndCountAll(options);
  },

  async getById(id) {
    return Appointment.findByPk(id);
  },
  async getServiceByAppointmentId(id) {
    const where = { appointment_id: id };
    return ServiceAppointment.findAll({ where });
  },

  async create(appointment) {
    let sum_duration = 0;
    await BarberRepository.getById(appointment.barber_id);

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

    let services = [];

    if (appointment.services_ids && appointment.services_ids.length > 0) {
      for (const service_id of appointment.services_ids) {
        const service = await ServiceRepository.getById(service_id);
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
    });

    const services_ids = [];

    for (const service of services) {
      try {
        await ServiceAppointment.create({
          service_id: service.id,
          appointment_id: newAppointment.id,
          price: service.price,
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

      for (const service_id of appointment.services_ids) {
        const service = await ServiceRepository.getById(service_id);
        sum_duration += service.duration;
        services.push(service);
      }

      if (appointment.total_duration == null) {
        appointment.total_duration = sum_duration;
      }

      await ServiceAppointment.destroy({
        where: { appointment_id: id },
      });

      for (const service of services) {
        await ServiceAppointment.create({
          service_id: service.id,
          appointment_id: id,
          price: service.price,
        });
      }
    }

    if (appointment.appointment_datetime) {
      appointment.appointment_datetime = formatDateForTimezone(
        appointment.appointment_datetime,
      );
    }

    await existingAppointment.update(appointment);

    const updatedServices = await this.getServiceByAppointmentId(id);
    const serviceDetails = await Promise.all(
      updatedServices.map(async (sa) => {
        const service = await ServiceRepository.getById(sa.service_id);
        return { id: service.id, name: service.name };
      }),
    );

    return {
      ...existingAppointment.toJSON(),
      services: serviceDetails,
    };
  },
  async delete(id) {
    const existingAppointment = await Appointment.findByPk(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
    await existingAppointment.destroy();
  },
  async getAvailabilityAppointments(barberId, from, to) {
    const fromFormatted = formatDateForTimezone(from);
    const toFormatted = formatDateForTimezone(to);

    const where = {};
    where.appointment_datetime = {
      [Op.gte]: fromFormatted,
      [Op.lte]: toFormatted,
    };
    if (barberId != null) where.barber_id = barberId;

    where.status = { [Op.in]: availability_states };
    return Appointment.findAll({ where });
  },
};
