import { AppointmentService } from "../services/appointment.service.js";
import { generateImageUrl } from "../utils/barber.utils.js";

export const AppointmentController = {
  async getAll(req, res) {
    try {
      const filters = {
        from: req.query.from,
        to: req.query.to,
        sort: req.query.sort,
        page: req.query.page,
        limit: req.query.limit,
        barber_id: req.query.barber_id,
        establishment_id: req.query.establishment_id,
      };

      if (
        (req.user?.role === "receptionist" || req.user?.role === "barber") &&
        req.user?.establishment_id
      ) {
        filters.establishment_id = req.user.establishment_id;
      }

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

      if (
        (req.user?.role === "receptionist" || req.user?.role === "barber") &&
        req.user?.establishment_id &&
        appointment.establishment_id !== req.user.establishment_id
      ) {
        return res
          .status(403)
          .json({ message: "Access denied to this appointment" });
      }

      appointment.image_finish_path = generateImageUrl(
        appointment.image_finish_path,
      );
      if (appointment.image_finish_path == null)
        delete appointment.image_finish_path;
      res.status(200).json(appointment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const appointmentData = req.body;

      if (req.user === null) appointmentData.status = "pending";

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

      if (
        (req.user?.role === "receptionist" || req.user?.role === "barber") &&
        req.user?.establishment_id
      ) {
        const existingAppointment = await AppointmentService.find(id);
        if (
          existingAppointment.establishment_id !== req.user.establishment_id
        ) {
          return res
            .status(403)
            .json({ message: "Access denied to this appointment" });
        }
      }

      const updatedAppointment = await AppointmentService.update(
        id,
        appointmentData,
      );
      res.status(200).json(updatedAppointment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (
        (req.user?.role === "receptionist" || req.user?.role === "barber") &&
        req.user?.establishment_id
      ) {
        const existingAppointment = await AppointmentService.find(id);
        if (
          existingAppointment.establishment_id !== req.user.establishment_id
        ) {
          return res
            .status(403)
            .json({ message: "Access denied to this appointment" });
        }
      }

      await AppointmentService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAvailability(req, res) {
    try {
      const filters = {
        from: req.query.from,
        barber_id: req.query.barber_id,
      };
      const slots = await AppointmentService.getAvailability(filters);

      res.status(200).json(slots);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async complete(req, res) {
    try {
      if (!req.is("multipart/form-data"))
        return res.status(400).json({
          error: "Content-Type must be multipart/form-data",
        });
      const { id } = req.params;

      if (
        (req.user?.role === "receptionist" || req.user?.role === "barber") &&
        req.user?.establishment_id
      ) {
        const existingAppointment = await AppointmentService.find(id);
        if (
          existingAppointment.establishment_id !== req.user.establishment_id
        ) {
          return res
            .status(403)
            .json({ message: "Access denied to this appointment" });
        }
      }

      const file = req.files?.[0];
      const filename = file ? file.filename : null;

      const appointment = await AppointmentService.complete(id, filename);

      appointment.image_finish_path = generateImageUrl(
        appointment.image_finish_path,
      );
      if (appointment.image_finish_path == null)
        delete appointment.image_finish_path;
      res.status(200).json({
        message: "Appointment completed successfully",
        appointment,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async cancel(req, res) {
    try {
      const { id } = req.params;

      if (
        (req.user?.role === "receptionist" || req.user?.role === "barber") &&
        req.user?.establishment_id
      ) {
        const existingAppointment = await AppointmentService.find(id);
        if (
          existingAppointment.establishment_id !== req.user.establishment_id
        ) {
          return res
            .status(403)
            .json({ message: "Access denied to this appointment" });
        }
      }

      const appointment = await AppointmentService.cancel(id);
      appointment.image_finish_path = generateImageUrl(
        appointment.image_finish_path,
      );

      if (appointment.image_finish_path == null)
        delete appointment.image_finish_path;
      res.status(200).json({
        message: "Appointment cancelled successfully",
        appointment,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
