import express from "express";
import { beforeEach, describe, expect, test } from "vitest";
import { requestApp } from "../helpers/request.js";
import {
  appointmentRepoMock,
  setupAppointmentMocks,
} from "./helpers/mock.helper.js";

setupAppointmentMocks();

const appointmentRouter = (await import("../../routes/appointment.routes.js"))
  .default;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/appointments", appointmentRouter);
  return app;
}

describe("Appointment client cancellation", () => {
  beforeEach(() => {
    Object.values(appointmentRepoMock).forEach((fn) => fn.mockReset());
  });

  test("POST /appointments/:id/cancel - client can cancel appointment without auth", async () => {
    const appointmentId = 123;
    const existingAppointment = {
      id: appointmentId,
      customer_name: "John Doe",
      customer_phone: "123456789",
      customer_email: "john@example.com",
      appointment_datetime: new Date("2024-05-20T10:00:00Z"),
      status: "confirmed",
      barber_id: 1,
    };

    const cancelledAppointment = {
      ...existingAppointment,
      status: "cancelled",
    };

    appointmentRepoMock.getById.mockResolvedValue(existingAppointment);
    appointmentRepoMock.update.mockResolvedValue(cancelledAppointment);

    const response = await requestApp(createApp(), {
      method: "POST",
      path: `/appointments/${appointmentId}/cancel`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Appointment cancelled successfully"
    );
    expect(response.body).toHaveProperty("appointment");
    expect(response.body.appointment.status).toBe("cancelled");
    expect(appointmentRepoMock.getById).toHaveBeenCalledWith(
      String(appointmentId)
    );
    expect(appointmentRepoMock.update).toHaveBeenCalledWith(
      String(appointmentId),
      {
        status: "cancelled",
      }
    );
  });

  test("POST /appointments/:id/cancel - returns 400 if appointment not found", async () => {
    const appointmentId = 999;

    appointmentRepoMock.getById.mockResolvedValue(null);

    const response = await requestApp(createApp(), {
      method: "POST",
      path: `/appointments/${appointmentId}/cancel`,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(appointmentRepoMock.getById).toHaveBeenCalledWith(
      String(appointmentId)
    );
    expect(appointmentRepoMock.update).not.toHaveBeenCalled();
  });
});
