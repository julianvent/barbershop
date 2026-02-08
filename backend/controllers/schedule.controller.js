import { ScheduleService } from "../services/schedule.service.js";

export const ScheduleController = {
  async getAll(req, res) {
    try {
      const filters = {};

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        filters.establishment_id = req.user.establishment_id;
      }

      const schedules = await ScheduleService.list(filters);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getByDay(req, res) {
    try {
      const { day_of_week } = req.params;
      const schedule = await ScheduleService.findByDay(day_of_week);
      res.status(200).json(schedule);
    } catch (error) {
      const code = error.code === "NOT_FOUND" ? 404 : 500;
      res.status(code).json({ message: error.message });
    }
  },
  async create(req, res) {
    try {
      const scheduleData = req.body;
      const newSchedule = await ScheduleService.create(scheduleData);
      res.status(201).json(newSchedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const { day_of_week } = req.params;
      const scheduleData = req.body;
      const updatedSchedule = await ScheduleService.update(
        day_of_week,
        scheduleData,
      );
      res.status(200).json(updatedSchedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createMultiple(req, res) {
    try {
      const schedules = req.body;
      const createdSchedules = await ScheduleService.createMultiple(schedules);
      res.status(201).json(createdSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async updateMultiple(req, res) {
    try {
      const schedules = req.body;
      const updatedSchedules = await ScheduleService.updateMultiple(schedules);
      res.status(200).json(updatedSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
