import express from "express";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { requestApp } from "../helpers/request.js";

const scheduleRepoMock = {
  getAll: vi.fn(),
  create: vi.fn(),
  getByDay: vi.fn(),
  update: vi.fn(),
};

vi.mock("../../repositories/schedule.repository.js", () => ({
  ScheduleRepository: scheduleRepoMock,
}));

vi.mock("../../middlewares/require.auth.middleware.js", () => ({
  default: (req, res, next) => next(),
}));

vi.mock("../../middlewares/require.admin.middleware.js", () => ({
  requireRole: () => (req, res, next) => next(),
}));

const scheduleRouter = (await import("../../routes/schedule.routes.js")).default;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/schedules", scheduleRouter);
  return app;
}

describe("Schedule routes workflow", () => {
  beforeEach(() => {
    Object.values(scheduleRepoMock).forEach((fn) => fn.mockReset());
  });

  test("GET /schedules returns rows from repository", async () => {
    const rows = [
      {
        day_of_week: "Monday",
        start_time: "09:00:00",
        end_time: "17:00:00",
        is_active: true,
      },
    ];
    scheduleRepoMock.getAll.mockResolvedValue(rows);

    const response = await requestApp(createApp(), { path: "/schedules" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rows);
    expect(scheduleRepoMock.getAll).toHaveBeenCalledTimes(1);
  });

  test("POST /schedules validates payload and persists via repository", async () => {
    const payload = {
      day_of_week: "Tuesday",
      start_time: "08:00:00",
      end_time: "16:00:00",
      is_active: true,
    };
    const created = { ...payload };
    scheduleRepoMock.create.mockResolvedValue(created);

    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/schedules",
      body: payload,
    });

    expect(response.status).toBe(201);
    expect(scheduleRepoMock.create).toHaveBeenCalledWith(payload);
    expect(response.body).toEqual(created);
  });

  test("POST /schedules rejects invalid day before hitting repository", async () => {
    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/schedules",
      body: {
        day_of_week: "Funday",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_active: true,
      },
    });

    expect(response.status).toBe(500);
    expect(response.body?.error).toContain("Invalid day of week");
    expect(scheduleRepoMock.create).not.toHaveBeenCalled();
  });

  test("PUT /schedules/:day_of_week propagates update to repository", async () => {
    const updatePayload = {
      start_time: "10:00:00",
      end_time: "18:00:00",
      is_active: false,
    };
    const updated = {
      day_of_week: "Wednesday",
      ...updatePayload,
    };
    scheduleRepoMock.update.mockResolvedValue(updated);

    const response = await requestApp(createApp(), {
      method: "PUT",
      path: "/schedules/Wednesday",
      body: updatePayload,
    });

    expect(response.status).toBe(200);
    expect(scheduleRepoMock.update).toHaveBeenCalledWith(
      "Wednesday",
      updatePayload
    );
    expect(response.body).toEqual(updated);
  });
});
