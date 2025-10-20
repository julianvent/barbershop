import { Appointment } from "../models/appointment.model.js";

export const AppointmentRepository = {
  async getAll(offset, limit) {
    return Appointment.findAll({
      offset,
      limit,
      order: [["fecha_hora_cita", "ASC"]],
    });
  },

  async getById(id) {
    return Appointment.findOne({ where: { id_cita: id } });
  },

  async create(appointment) {
    const newAppointment = await Appointment.create({
      nombre_cliente: appointment.nombre_cliente,
      numero_telefonico_cliente: appointment.numero_telefonico_cliente,
      fecha_hora_cita: appointment.fecha_hora_cita,
      duracion_total: appointment.duracion_total,
      estado: appointment.estado,
    });
    return newAppointment;
  },

  async update(id, appointment) {
    const existingAppointment = await Appointment.findOne({
      where: { id_cita: id },
    });
    if (!existingAppointment) {
      throw new Error("Cita no encontrada");
    }
    await existingAppointment.update(appointment);
    return existingAppointment;
  },

  async delete(id) {
    const existingAppointment = await Appointment.findOne({
      where: { id_cita: id },
    });
    if (!existingAppointment) {
      throw new Error("Cita no encontrada");
    }
    await existingAppointment.destroy();
  },
};
