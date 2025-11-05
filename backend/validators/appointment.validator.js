// Valid appointment statuses
const states = ["pending", "confirmed", "completed", "cancelled"];

const WhiteListQueryParams = [
  "customer_name",
  "customer_phone",
  "appointment_datetime",
  "total_duration",
  "status",
];

export const AppointmentValidator = {
  validateCreate(data) {
    const requiredFields = WhiteListQueryParams;
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!states.includes(data.status)) {
      throw new Error(
        `Invalid status value. Must be one of: ${states.join(", ")}`
      );
    }

    if (!Number.isInteger(data.total_duration) || data.total_duration <= 0) {
      throw new Error(
        "total_duration must be a positive integer representing minutes"
      );
    }
  },
};
