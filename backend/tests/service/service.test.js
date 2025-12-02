import express from "express";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { requestApp } from "../helpers/request.js";

const serviceRepoMock = {
  list: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  deactivate: vi.fn(),
};

vi.mock("../../repositories/service.repository.js", () => ({
  ServiceRepository: serviceRepoMock,
}));

vi.mock("../../middlewares/require.auth.middleware.js", () => ({
  default: (req, res, next) => next(),
}));

vi.mock("../../middlewares/require.admin.middleware.js", () => ({
  requireRole: () => (req, res, next) => next(),
}));

const serviceRouter = (await import("../../routes/service.routes.js")).default;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/services", serviceRouter);
  return app;
}

describe("Service routes workflow", () => {
  beforeEach(() => {
    Object.values(serviceRepoMock).forEach((fn) => fn.mockReset());
  });

  test("GET /services forwards query params to repository.list", async () => {
    const payload = {
      data: [{ id: 1, name: "Skin Fade", price: 250 }],
      meta: { page: 2, limit: 5, total: 1, pages: 1 },
    };
    serviceRepoMock.list.mockResolvedValue(payload);

    const response = await requestApp(createApp(), {
      path: "/services",
      query: { page: "2", limit: "5", q: "fade", sort: "price", dir: "DESC" },
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(payload);
    expect(serviceRepoMock.list).toHaveBeenCalledWith({
      page: "2",
      limit: "5",
      q: "fade",
      sort: "price",
      dir: "DESC",
    });
  });

  test("GET /services/:id returns service from repository", async () => {
    const service = {
      id: 7,
      name: "Deluxe Trim",
      description: "Hot towel + cut",
      price: 350,
      duration: 60,
      type: "hair",
      status: "active",
    };
    serviceRepoMock.getById.mockResolvedValue(service);

    const response = await requestApp(createApp(), {
      path: "/services/7",
    });

    expect(response.status).toBe(200);
    expect(serviceRepoMock.getById).toHaveBeenCalledWith("7");
    expect(response.body).toEqual(service);
  });

  test("GET /services/:id returns 404 when service is missing", async () => {
    serviceRepoMock.getById.mockResolvedValue(null);

    const response = await requestApp(createApp(), {
      path: "/services/999",
    });

    expect(response.status).toBe(404);
    expect(response.body?.error).toContain("Service not found");
  });

  test("POST /services trims input and persists via repository", async () => {
    const payload = {
      name: "  Premium Fade  ",
      description: "Includes beard trim",
      price: 280,
      duration: 50,
      type: "hair",
    };
    const created = { ...payload, name: "Premium Fade", status: "active", id: 3 };
    serviceRepoMock.create.mockResolvedValueOnce(created);

    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/services",
      body: payload,
    });

    expect(response.status).toBe(201);
    expect(serviceRepoMock.create).toHaveBeenCalledWith({
      ...payload,
      name: "Premium Fade",
    });
    expect(response.body).toEqual(created);
  });

  test("POST /services rejects missing fields before hitting repository", async () => {
    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/services",
      body: { name: "Edge Up" },
    });

    expect(response.status).toBe(400);
    expect(response.body?.error).toContain("Missing required field");
    expect(serviceRepoMock.create).not.toHaveBeenCalled();
  });

  test("POST /services surfaces duplicate error from repository", async () => {
    const payload = {
      name: "Premium Fade",
      description: "Includes beard trim",
      price: 280,
      duration: 50,
      type: "hair",
    };
    serviceRepoMock.create.mockRejectedValueOnce(new Error("duplicate"));

    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/services",
      body: payload,
    });

    expect(response.status).toBe(400);
    expect(response.body?.error).toContain("already exists");
  });

  test("PUT /services/:id updates the resource", async () => {
    const updatePayload = {
      price: 320,
      status: "inactive",
    };
    const updated = {
      id: 2,
      name: "Premium Fade",
      description: "Updated desc",
      duration: 45,
      type: "hair",
      ...updatePayload,
    };
    serviceRepoMock.getById.mockResolvedValueOnce({
      id: 2,
      name: "Premium Fade",
    });
    serviceRepoMock.update.mockResolvedValueOnce(updated);

    const response = await requestApp(createApp(), {
      method: "PUT",
      path: "/services/2",
      body: updatePayload,
    });

    expect(response.status).toBe(200);
    expect(serviceRepoMock.getById).toHaveBeenCalledWith("2");
    expect(serviceRepoMock.update).toHaveBeenCalledWith("2", updatePayload);
    expect(response.body).toEqual(updated);
  });

  test("PUT /services/:id rejects invalid fields and skips repository", async () => {
    const response = await requestApp(createApp(), {
      method: "PUT",
      path: "/services/2",
      body: { invalid: true },
    });

    expect(response.status).toBe(400);
    expect(response.body?.error).toContain("Invalid field");
    expect(serviceRepoMock.update).not.toHaveBeenCalled();
  });

  test("DELETE /services/:id deactivates the service", async () => {
    serviceRepoMock.deactivate.mockResolvedValueOnce(true);

    const response = await requestApp(createApp(), {
      method: "DELETE",
      path: "/services/5",
    });

    expect(response.status).toBe(204);
    expect(serviceRepoMock.deactivate).toHaveBeenCalledWith("5");
  });

  test("DELETE /services/:id returns 404 when repository reports no change", async () => {
    serviceRepoMock.deactivate.mockResolvedValueOnce(false);

    const response = await requestApp(createApp(), {
      method: "DELETE",
      path: "/services/5",
    });

    expect(response.status).toBe(404);
    expect(response.body?.error).toContain("Service not found");
  });
});
