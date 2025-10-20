import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { AppointmentValidator } from "../validators/appointment.validator.js";

export const AppointmentService = {

    async list(page, limit) {
        const offset = (page - 1) * limit;
        return AppointmentRepository.getAll(offset, limit);
    },

    async find(id) {
        const appointment = await AppointmentRepository.getById(id);
        if (!appointment) {
            throw new Error('Cita no encontrada');
        }
        return appointment;
    },

    async create(appointmentData) {
        AppointmentValidator.validateCreate(appointmentData);
        return AppointmentRepository.create(appointmentData);
    },

    async update(id, appointmentData) {
        const existingAppointment = await AppointmentRepository.getById(id);
        if (!existingAppointment) {
            throw new Error('Cita no encontrada');
        }
        return AppointmentRepository.update(id, appointmentData);
    },

    async delete(id) {
        const existingAppointment = await AppointmentRepository.getById(id);
        if (!existingAppointment) {
            throw new Error('Cita no encontrada');
        }
        return AppointmentRepository.delete(id);
    }

};
