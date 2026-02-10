const validFields = ["start_time", "end_time", "is_active", "day_of_week"];
const validUpdateFields = ["start_time", "end_time", "is_active"];
const optionalFields = ["establishment_id"];
export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const ScheduleValidator = {
  validateCreate(schedule) {
    if (!schedule || typeof schedule !== "object") {
      throw new Error("Body is empty or invalid");
    }
    
    // Check all fields in the schedule are valid
    for (const field in schedule) {
      if (!validFields.includes(field) && !optionalFields.includes(field)) {
        throw new Error(`Invalid field: ${field}`);
      }
    }
    
    // Check required fields are present
    for (const field of validFields) {
      if (!(field in schedule)) {
        throw new Error(`Missing required field: ${field}`);
      }
      if (field === "day_of_week" && !DAYS.includes(schedule.day_of_week)) {
        throw new Error(
          `Invalid day of week. Must be one of: ${DAYS.join(", ")}`
        );
      }
    }
  },

  validateUpdate(day_of_week, scheduleData) {
    if (!scheduleData || typeof scheduleData !== "object") {
      throw new Error("Body is empty or invalid");
    }
    for (const field in scheduleData) {
      if (!validUpdateFields.includes(field) && !optionalFields.includes(field)) {
        throw new Error(`Invalid field in update: ${field}`);
      }
    }
    if (!DAYS.includes(day_of_week)) {
      throw new Error(
        `Invalid day of week in URL. Must be one of: ${DAYS.join(", ")}`
      );
    }
  },

  validateFindByDay(day_of_week) {
    if (!DAYS.includes(day_of_week)) {
      throw new Error(
        `Invalid day of week. Must be one of: ${DAYS.join(", ")}`
      );
    }
  },
};
