import { ScheduleValidator } from "../validators/schedule.validator.js";
import { ScheduleRepository } from "../repositories/schedule.repository.js";

export const ScheduleService = {
  async list() {
    return ScheduleRepository.getAll();
  },
  async create(scheduleData) {
    ScheduleValidator.validateCreate(scheduleData);
    return ScheduleRepository.create(scheduleData);
  },
  async findByDay(day_of_week) {
    ScheduleValidator.validateFindByDay(day_of_week);
    return ScheduleRepository.getByDay(day_of_week);
  },
  async update(day_of_week, scheduleData) {
    ScheduleValidator.validateUpdate(day_of_week, scheduleData);
    return ScheduleRepository.update(day_of_week, scheduleData);
  },

  // In case the user wants to create schedules for multiple days at once
  // e.g., creating schedules for Monday, Wednesday, and Friday in one request
  // where the user works from 9 AM to 5 PM on those days
  async createMultiple(schedules) {
    const createdSchedules = [];
    for (const schedule of schedules) {
      const created = await this.create(schedule);
      createdSchedules.push(created);
    }
    return createdSchedules;
  },

  async updateMultiple(days_of_week, scheduleDataArray) {
    const updatedSchedules = [];
    for (const scheduleData of scheduleDataArray) {
      const updated = await this.update(days_of_week, scheduleData);
      updatedSchedules.push(updated);
    }
    return updatedSchedules;
  },
};
