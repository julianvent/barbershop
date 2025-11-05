import { Appointment } from "../models/appointment.model.js";

export const AppointmentRepository = {
  async getAll(offset, limit) {
    return Appointment.findAll({
      offset,
      limit,
      order: [["appointment_datetime", "ASC"]],
    });
  },

  async getById(id) {
    return Appointment.findByPk(id);
  },

  async create(appointment) {
    const newAppointment = await Appointment.create({
      customer_name: appointment.customer_name,
      customer_phone: appointment.customer_phone,
      appointment_datetime: appointment.appointment_datetime,
      total_duration: appointment.total_duration,
      status: appointment.status,
    });
    return newAppointment;
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
};
