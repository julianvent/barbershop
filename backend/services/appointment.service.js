import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { BarberRepository } from "../repositories/barber.repository.js";
import { ScheduleRepository } from "../repositories/schedule.repository.js";
import { ServiceRepository } from "../repositories/service.repository.js";
import { AppointmentValidator } from "../validators/appointment.validator.js";
import { NotificationService } from "./notifications/helper/notification.service.js";
import { DAYS } from "../validators/schedule.validator.js";

const MARGIN = 15;
export const AppointmentService = {
  async list(filters) {
    const { barber_id, from, to, sort, page, limit } = await AppointmentValidator.validateFiltersListAppointments(filters);
    const offset = (page - 1) * limit;

    const { rows: appointments, count } = await AppointmentRepository.getAll({
      barberId: barber_id,
      statusAppointment: filters.status_appointment,
      from,
      to,
      sort,
      offset,
      limit
    });

    const response_appointments = await Promise.all(
      appointments.map(async (appointment) => {
        const barber_data = await BarberRepository.getById(appointment.barber_id)

        const json = appointment.toJSON()
        return {
          ...json,
          barber: { name: barber_data.barber_name, barber_id: barber_data.id }
        };
      }));
    return {
      data: response_appointments,
      meta: {
        page: page,
        limit: limit,
        total: count,
        pages: page
      }
    }
  },

  async find(id) {

    const appointment = await AppointmentRepository.getById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    const services = await AppointmentRepository.getServiceByAppointmentId(id);

    const barber = await BarberRepository.getById(appointment.barber_id)

    let costTotal = 0;

    const serviceInfo = await Promise.all(
      services.map(async (service) => {

        const serviceData = await ServiceRepository.getById(service.service_id);
        costTotal += service.price;
        return { id: serviceData.id, name: serviceData.name, price: service.price, duration: serviceData.duration };
      }));

    const { barber_id, ...appointment_data } = appointment.toJSON();

    return {
      ...appointment_data,
      cost_total: costTotal,
      services: serviceInfo,
      barber_id: barber.id,
      barber: {
        barber_id: barber.id,
        barber_name: barber.barber_name
      }
    };
  },

  async create(appointmentData) {
    AppointmentValidator.validateCreate(appointmentData);
    const newAppointment = await AppointmentRepository.create(appointmentData);
    try {
      await NotificationService.appointmentCreated(newAppointment);
    } catch (error) {
      console.error("Error sending appointment created notification:", error);
    }
    return newAppointment;
  },

  async update(id, appointmentData) {
    const existingAppointment = await AppointmentRepository.getById(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
    const updatedAppointment = await AppointmentRepository.update(
      id,
      appointmentData
    );
    await NotificationService.appointmentUpdated(updatedAppointment);
    return updatedAppointment;
  },

  async delete(id) {
    const existingAppointment = await AppointmentRepository.getById(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
    await NotificationService.appointmentCanceled(existingAppointment);
    return AppointmentRepository.delete(id);
  },
  async getAvailability(filters) {

    const { from, to } = await AppointmentValidator.validateAvailabilityAppointment(filters);

    let barberIds = []

    if (filters.barber_id) barberIds = [filters.barber_id]
    else {
      barberIds = await BarberRepository.getAllIds()
      barberIds = barberIds.map(barber => barber.id);
    }
    const results = [];

    for (const barberId of barberIds) {

      const appointments = await AppointmentRepository.getAvailabilityAppointments(barberId, from, to);
      const schedule = await ScheduleRepository.getByDay(DAYS[from.getDay()]);

      const workStart = new Date(from);
      const [h1, m1, s1] = schedule.start_time.split(":").map(Number);
      workStart.setHours(h1, m1, s1, 0);

      const workEnd = new Date(from);
      const [h2, m2, s2] = schedule.end_time.split(":").map(Number);
      workEnd.setHours(h2, m2, s2, 0);

      const slots = [];
      let current = new Date(workStart);

      while (current < workEnd) {
        slots.push(new Date(current));
        current = new Date(current.getTime() + MARGIN * 60000);
      }

      const intervals = appointments.map(app => {
        const start = new Date(app.appointment_datetime).getTime();
        const end = start + app.total_duration * 60000;
        return { start, end };
      });

      const freeSlots = slots.filter(slot => {
        const slotTime = slot.getTime();
        return !intervals.some(({ start, end }) => {
          return slotTime >= start && slotTime < end;
        });
      });

      const freeSlotsZone = freeSlots.map(slot => {
        const hours = slot.getHours().toString().padStart(2, "0");
        const minutes = slot.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      });

      results.push({
        barberId,
        slots: freeSlotsZone,
      });
    }

    return {
      date: from,
      barbers: results
    };
  }
};
