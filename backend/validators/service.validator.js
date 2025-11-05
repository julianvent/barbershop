const VALID_FIELDS = ["name", "description", "price", "duration", "type"]; // status is optional (default to "active")

export const ServiceValidator = {
  validateCreate(body) {
    if (!body || Object.keys(body).length === 0) {
      throw new Error("Body is empty or invalid");
    }
    for (const field of VALID_FIELDS) {
      if (!(field in body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  },
  validateUpdate(body) {
    if (!body || Object.keys(body).length === 0) {
      throw new Error("Body is empty or invalid");
    }
    for (const field in body) {
      if (!VALID_FIELDS.includes(field) && field !== "status") {
        throw new Error(`Invalid field in update: ${field}`);
      }
    }
  },
};
