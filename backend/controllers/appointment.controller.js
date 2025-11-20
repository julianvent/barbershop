import { AppointmentService } from "../services/appointment.service.js";

export const AppointmentController = {

    async getAll(req, res) {
        try {
            const filters = {
                from: req.query.from,
                to: req.query.to,
                sort: req.query.sort,
                page: req.query.page,
                limit: req.query.limit,
                barber_id: req.query.barber_id
            };
            const appointments = await AppointmentService.list(filters);
            res.status(200).json(appointments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const appointment = await AppointmentService.find(id);
            res.status(200).json(appointment);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const appointmentData = req.body;
            const newAppointment = await AppointmentService.create(appointmentData);
            res.status(201).json(newAppointment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const appointmentData = req.body;
            const updatedAppointment = await AppointmentService.update(id, appointmentData);
            res.status(200).json(updatedAppointment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            await AppointmentService.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getAvailability(req, res){
        try {
            const filters = {
                from: req.query.from,
                barber_id: req.query.barber_id
            } ;
            const slots = await AppointmentService.getAvailability(filters);

            res.status(200).json(slots)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

};