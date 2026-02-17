// Valid appointment statuses
export const states = ["pending", "confirmed", "completed", "cancelled"];
const MAX_MONTH = 1;
const WhiteListQueryParams = [
  "barber_id",
  "customer_name",
  "customer_phone",
  "appointment_datetime",
  "status",
  "services_ids",
];
const orderValues = ["ASC", "DESC"];

export const AppointmentValidator = {
  validateCreate(data) {
    const requiredFields = WhiteListQueryParams;
    const missing = [];
    for (const field of requiredFields) {
      if (!(field in data)) {
        missing.push(field);
      }
    }
    if (missing.length != 0) {
      throw new Error(`Missing required field: ${missing.join(", ")}`);
    }

    if (data.customer_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.customer_email)) {
        throw new Error("Invalid email format");
      }
    }

    if (!states.includes(data.status)) {
      throw new Error(
        `Invalid status value. Must be one of: ${states.join(", ")}`,
      );
    }

    if (
      (data.total_duration != null && !Number.isInteger(data.total_duration)) ||
      data.total_duration <= 0
    ) {
      throw new Error(
        "total_duration must be a positive integer representing minutes",
      );
    }

    if (
      data.establishment_id != null &&
      !Number.isInteger(Number(data.establishment_id))
    ) {
      throw new Error("establishment_id must be an integer");
    }

    const dt = new Date(data.appointment_datetime);
    if (Number.isNaN(dt.getTime())) {
      throw new Error("appointment_datetime must be a valid date");
    }
    const now = Date.now();
    const max = new Date();
    max.setMonth(max.getMonth() + MAX_MONTH);

    if (dt.getTime() < now) {
      throw new Error("appointment_datetime must be in the future");
    }
    if (dt.getTime() > max.getTime()) {
      // Verificar primero si vale la pena limitar por meses, y si manejar MM/DD/AAAA o DD/MM/AAAA
      throw new Error(
        `appointment_datetime must be within the next ${MAX_MONTH} months`,
      );
    }

    if (!Array.isArray(data.services_ids) || data.services_ids.length === 0) {
      // check int
      throw new Error("services_ids must be a non-empty array");
    }
  },
  validateFiltersListAppointments(filters) {
    const fromDate = filters.from != null ? new Date(filters.from) : null;
    const toDate = filters.to != null ? new Date(filters.to) : null;
    if (toDate != null) toDate.setHours(23, 59, 59, 999);
    const sort = filters.sort != null ? filters.sort : null;
    const barberId =
      filters.barber_id != null ? Number(filters.barber_id) : null;
    const page = filters.page != null ? Number(filters.page) : null;
    const limit = filters.limit != null ? Number(filters.limit) : null;
    const status = filters.status != null ? filters.status : null;
    const establishmentId =
      filters.establishment_id != null
        ? Number(filters.establishment_id)
        : null;

    if (status != null && !states.includes(status)) {
      throw new Error(
        `Invalid status value. Must be one of: ${states.join(", ")}`,
      );
    }

    if (barberId != null && !Number.isInteger(barberId)) {
      throw new Error("barber_id must be an integer");
    }

    if (establishmentId != null && !Number.isInteger(establishmentId)) {
      throw new Error("establishment_id must be an integer");
    }

    if (sort != null && !orders.includes(sort)) {
      throw new Error(
        `Invalid status value. Must be one of: ${orders.join(", ")}`,
      );
    }

    if (page != null && (!Number.isInteger(page) || page <= 0)) {
      throw new Error("page must be a positive integer");
    }

    if (limit != null && (!Number.isInteger(limit) || limit <= 0)) {
      throw new Error("limit must be a positive integer");
    }

    if (filters.status != null && !states.includes(filters.status)) {
      throw new Error(
        `Invalid status value. Must be one of: ${states.join(", ")}`,
      );
    }

    if (
      filters.orderValue != null &&
      orderValue != null &&
      !orderValues.includes(orderValue)
    ) {
      throw new Error(
        `Invalid order value. Must be one of: ${orderValues.join(", ")}`,
      );
    }

    if (fromDate && Number.isNaN(fromDate.getTime())) {
      throw new Error("from must be a valid date");
    }

    if (toDate && Number.isNaN(toDate.getTime())) {
      throw new Error("to must be a valid date");
    }

    if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
      throw new Error("from can't be greater than to");
    }

    return {
      barber_id: barberId,
      establishment_id: establishmentId,
      from: fromDate,
      to: toDate,
      sort: sort ?? "ASC",
      page: filters.page ?? 1,
      limit: limit ?? null,
    };
  },
  validateAvailabilityAppointment(filters) {
    const barberId =
      filters.barber_id != null ? Number(filters.barber_id) : null;

    let fromDate;
    if (filters.from != null) {
      const [year, month, day] = filters.from.split("-").map(Number);
      fromDate = new Date(year, month - 1, day);
    } else fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(fromDate);
    toDate.setHours(23, 59, 59, 999);

    if (barberId != null && !Number.isInteger(barberId)) {
      throw new Error("barber_id must be an integer");
    }

    if (Number.isNaN(fromDate.getTime())) {
      throw new Error("Missing required field: from");
    }

    if (Number.isNaN(toDate.getTime())) {
      throw new Error("to must be a valid date");
    }

    if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
      throw new Error("from can't be greater than to");
    }
    return {
      from: fromDate,
      to: toDate,
    };
  },
};
