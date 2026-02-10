import { ScheduleService } from "../services/schedule.service.js";

export const ScheduleController = {
  async getAll(req, res) {
    try {
      const filters = {};

      filters.establishment_id = req.query.establishment_id;

      const schedules = await ScheduleService.list(filters);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getByDay(req, res) {
    try {
      const { day_of_week } = req.params;
      let establishment_id =
        req.query.establishment_id || req.body.establishment_id;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      const schedule = await ScheduleService.findByDay(
        day_of_week,
        establishment_id,
      );
      res.status(200).json(schedule);
    } catch (error) {
      const code = error.code === "NOT_FOUND" ? 404 : 500;
      res.status(code).json({ message: error.message });
    }
  },
  async create(req, res) {
    try {
      let establishment_id = req.body.establishment_id;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      if (!establishment_id) {
        return res.status(400).json({ error: "establishment_id is required" });
      }

      const scheduleData = { ...req.body, establishment_id };
      const newSchedule = await ScheduleService.create(scheduleData);
      res.status(201).json(newSchedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const { day_of_week } = req.params;
      let establishment_id = req.body.establishment_id;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      if (!establishment_id) {
        return res.status(400).json({ error: "establishment_id is required" });
      }

      const scheduleData = req.body;
      const updatedSchedule = await ScheduleService.update(
        day_of_week,
        scheduleData,
        establishment_id,
      );
      res.status(200).json(updatedSchedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createMultiple(req, res) {
    try {
      let establishment_id = req.body.establishment_id;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      if (!establishment_id) {
        return res.status(400).json({ error: "establishment_id is required" });
      }

      const schedules = (req.body.schedules || req.body).map((schedule) => ({
        ...schedule,
        establishment_id,
      }));
      const createdSchedules = await ScheduleService.createMultiple(schedules);
      res.status(201).json(createdSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async updateMultiple(req, res) {
    try {
      let establishment_id = req.body.establishment_id;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      if (!establishment_id) {
        return res.status(400).json({ error: "establishment_id is required" });
      }

      const schedules = req.body.schedules || req.body;
      const updatedSchedules = await ScheduleService.updateMultiple(
        schedules,
        establishment_id,
      );
      res.status(200).json(updatedSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const { day_of_week } = req.params;
      let establishment_id =
        req.body.establishment_id || req.query.establishment_id;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      // Admins must specify establishment_id
      if (!establishment_id) {
        return res.status(400).json({ error: "establishment_id is required" });
      }

      await ScheduleService.delete(day_of_week, establishment_id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
