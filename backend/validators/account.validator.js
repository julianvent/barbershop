const validRoles = ["admin", "barber", "receptionist"];
const allowedFields = ["full_name", "password", "role", "email"];
const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";
const loginFields = ["email", "password"];

export const AccountValidator = {
  validateCreate(account) {
    if (!account || typeof account !== "object") {
      throw new Error("Body is empty or invalid");
    }
    for (const field of allowedFields) {
      if (!(field in account)) {
        throw new Error(`Missing required field: ${field}`);
      }
      if (field === "role" && !validRoles.includes(account.role)) {
        throw new Error(
          `Invalid role. Must be one of: ${validRoles.join(", ")}`
        );
      }
    }
  },

  validateUpdate(account) {
    if (!account || typeof account !== "object") {
      throw new Error("Body is empty or invalid");
    }

    if ("role" in account && !validRoles.includes(account.role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
    }

    if ("full_name" in account && !isNonEmptyString(account.full_name)) {
      throw new Error("full_name cannot be empty");
    }

    if ("password" in account && !isNonEmptyString(account.password)) {
      throw new Error("password cannot be empty");
    }
  },

  validateLogin(email, password) {
    if (!password) throw new Error("Missing required field: password");
    if (!email) throw new Error("Missing required field: email");

    if (!isNonEmptyString(email)) {
      throw new Error("email cannot be empty");
    }
    if (!isNonEmptyString(password)) {
      throw new Error("password cannot be empty");
    }
  },
};
