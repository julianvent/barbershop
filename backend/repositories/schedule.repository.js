import { Schedule } from "../models/schedule.model.js";

const RETURN_ATTRS = [
  "id",
  "day_of_week",
  "start_time",
  "end_time",
  "is_active",
  "establishment_id",
];

export const ScheduleRepository = {
  async getAll(filters = {}) {
    const where = {};

    if (filters.establishment_id) {
      where.establishment_id = filters.establishment_id;
    }

    const schedules = await Schedule.findAll({
      where,
      attributes: RETURN_ATTRS,
    });
    return schedules;
  },

  async create(scheduleData) {
    try {
      const existingSchedule = await Schedule.findOne({
        where: {
          day_of_week: scheduleData.day_of_week,
          establishment_id: scheduleData.establishment_id,
        },
      });
      if (existingSchedule) {
        throw new Error(
          `Schedule already exists for day ${scheduleData.day_of_week} at this establishment`,
        );
      }
      const newSchedule = await Schedule.create({
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
        is_active: scheduleData.is_active,
        day_of_week: scheduleData.day_of_week,
        establishment_id: scheduleData.establishment_id,
      });
      return Schedule.findByPk(newSchedule.id, {
        attributes: RETURN_ATTRS,
      });
    } catch (error) {
      throw new Error("Error creating schedule: " + error.message);
    }
  },

  async getByDay(day_of_week) {
    const schedule = await Schedule.findOne({
      where: { day_of_week },
      attributes: RETURN_ATTRS,
    });
    if (!schedule) {
      throw new Error(`Schedule not found for day ${day_of_week}`);
    }
    return schedule;
  },

  async update(day_of_week, scheduleData) {
    const existingSchedule = await this.getByDay(day_of_week);
    // No need for null check - getByDay throws if not found
    await Schedule.update(scheduleData, {
      where: { day_of_week: existingSchedule.day_of_week },
    });

    return Schedule.findOne({
      where: { day_of_week },
      attributes: RETURN_ATTRS,
    });
  },
};
