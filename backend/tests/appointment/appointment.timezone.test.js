import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import { Appointment } from "../../models/appointment.model.js";
import { Barber } from "../../models/barber.model.js";
import { formatDateForTimezone } from "../../utils/appointment.utils.js";

const DB_TIMEZONE = "-06:00"; // GMT-06:00 offset enforced on the DB session

let testBarber;

async function fetchStoredDateString(appointmentId) {
  const rows = await sequelize.query(
    "SELECT DATE_FORMAT(appointment_datetime, '%Y-%m-%d %H:%i:%s') AS `date` FROM appointment WHERE id = ?",
    { replacements: [appointmentId], type: QueryTypes.SELECT }
  );
  return rows[0]?.date;
}

beforeAll(async () => {
  testBarber = await Barber.create({
    barber_name: "Test Barber",
    image_path: "test.jpg",
    is_active: true,
    email: "testbarber@example.com",
    phone: "1234567890",
  });
});

afterAll(async () => {
  if (testBarber) {
    await testBarber.destroy();
  }
  await sequelize.close();
});

describe("Appointment Timezone", () => {
  it("keeps Sequelize and the DB session locked to GMT-06:00", async () => {
    expect(sequelize.options.timezone).toBe(DB_TIMEZONE);

    const [{ session_tz }] = await sequelize.query(
      "SELECT @@session.time_zone AS session_tz",
      { type: QueryTypes.SELECT }
    );

    expect(session_tz).toBe(DB_TIMEZONE);
  });

  it("stores UTC appointment datetimes converted to GMT-06:00", async () => {
    const appointment_datetime = new Date("2024-12-02T18:00:00.000Z");
    const expectedStored = formatDateForTimezone(
      appointment_datetime,
      DB_TIMEZONE
    );

    const testAppointment = await Appointment.create({
      customer_name: "John Doe",
      customer_phone: "5551234567",
      customer_email: "john@example.com",
      appointment_datetime,
      total_duration: 30,
      status: "pending",
      barber_id: testBarber.id,
    });

    try {
      const stored = await fetchStoredDateString(testAppointment.id);
      expect(stored).toBe(expectedStored);
    } finally {
      await testAppointment.destroy();
    }
  });

  it("normalizes incoming non-GMT-06:00 offsets to GMT-06:00 before saving", async () => {
    const appointment_datetime = new Date("2024-12-02T09:15:00+02:00");
    const expectedStored = formatDateForTimezone(
      appointment_datetime,
      DB_TIMEZONE
    );

    const testAppointment = await Appointment.create({
      customer_name: "Jane Smith",
      customer_phone: "5559876543",
      customer_email: "jane@example.com",
      appointment_datetime,
      total_duration: 45,
      status: "pending",
      barber_id: testBarber.id,
    });

    try {
      const stored = await fetchStoredDateString(testAppointment.id);
      expect(stored).toBe(expectedStored);
    } finally {
      await testAppointment.destroy();
    }
  });
});
