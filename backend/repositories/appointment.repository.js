import { Appointment } from "../models/appointment.model.js";
import { ServiceRepository } from "./service.repository.js";
import { ServiceAppointment } from "../models/service.appointment.model.js";
import { BarberRepository } from "../repositories/barber.repository.js";
import { Op } from "sequelize";
import { DAYS } from "../validators/schedule.validator.js";
import { ScheduleRepository } from "./schedule.repository.js";
import { setTimeToDate } from "../utils/appointment.utils.js";

const availability_states = ["pending", "confirmed"];

export const AppointmentRepository = {
  async getAll({
    barberId = null,
    statusAppointment = null,
    from = null,
    to = null,
    sort = "ASC",
    offset = 0,
    limit = 20
  } = {}) {
    const where = {};
    if(barberId != null) where.barber_id = barberId

    if(from || to) {
      where.appointment_datetime = {
        ...(from? {[Op.gte]: from}: {}),
        ...(to?{[Op.lte]: to}: {})
      }
    }
    if(statusAppointment) where.status = statusAppointment
    const order = [['appointment_datetime', sort] ]
    const options = {
      where,
      order
    };
    if (offset != null) options.offset = offset;
    if (limit  != null) options.limit  = limit;

    return Appointment.findAndCountAll(options);
  },

  async getById(id) {
    return Appointment.findByPk(id);
  },
  async getServiceByAppointmentId(id){
    const where  = { appointment_id: id}
    return ServiceAppointment.findAll({where})
  },
  async create(appointment) {
    let sum_duration = 0;

    await BarberRepository.getById(appointment.barber_id);
    const appointmentDate = new Date(appointment.appointment_datetime);

    const day_of_week = DAYS[appointmentDate.getDay()]

    const schedule = await ScheduleRepository.getByDay(day_of_week)
    const scheduleStartDate = setTimeToDate(appointmentDate, schedule.start_time)
    const scheduleEndDate = setTimeToDate(appointmentDate, schedule.end_time)

    if(appointmentDate < scheduleStartDate || appointmentDate > scheduleEndDate ) {
      throw new Error("The appointment time is outside of the allowed schedule");
    }

    const newAppointment = await Appointment.create({
      customer_name: appointment.customer_name,
      customer_phone: appointment.customer_phone,
      customer_email: appointment.customer_email || null,
      appointment_datetime: appointment.appointment_datetime,
      total_duration: appointment.total_duration ?? 0,
      status: appointment.status,
      barber_id: appointment.barber_id
    });

    const services_ids = []
    for (const service_id of appointment.services_ids) {
      try {
        const service = await ServiceRepository.getById(service_id);
        sum_duration += service.duration;

        await ServiceAppointment.create({
          service_id,
          appointment_id: newAppointment.id,
          price: service.price,
        });
        services_ids.push(service)
      } catch (err){
        console.error('schedule error:', err.message);
      }
    }
    if (appointment.total_duration == null)
      await newAppointment.update({ total_duration: sum_duration });

    return {
      ...newAppointment.toJSON(),
      services: services_ids.map( service => ({
        id: service.id,
        name: service.name
      }))
    };
  },

  async update(id, appointment) {
    const existingAppointment = await Appointment.findByPk(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
    await existingAppointment.update(appointment);
    return existingAppointment;
  },
  async delete(id) {
    const existingAppointment = await Appointment.findByPk(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
    await existingAppointment.destroy();
  },
  async getAvabialityAppointments(barberId, from, to){
    const where = {}
    where.appointment_datetime = {
      [Op.gte]: from,
      [Op.lte]: to
    }
    if(barberId != null) where.barber_id = barberId

    where.status = { [Op.in]: availability_states}
    return Appointment.findAll({where})
  }
};
