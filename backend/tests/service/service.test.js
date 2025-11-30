import express from "express";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { requestApp } from "../helpers/request.js";

const serviceRepoMock = {
  list: vi.fn(),
  getByName: vi.fn(),
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
      data: [{ name: "Skin Fade", price: 250 }],
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

  test("GET /services/:name returns service from repository", async () => {
    const service = {
      name: "Deluxe Trim",
      description: "Hot towel + cut",
      price: 350,
      duration: 60,
      type: "hair",
      status: "active",
    };
    serviceRepoMock.getByName.mockResolvedValue(service);

    const response = await requestApp(createApp(), {
      path: "/services/Deluxe%20Trim",
    });

    expect(response.status).toBe(200);
    expect(serviceRepoMock.getByName).toHaveBeenCalledWith("Deluxe Trim");
    expect(response.body).toEqual(service);
  });

  test("GET /services/:name returns 404 when service is missing", async () => {
    serviceRepoMock.getByName.mockResolvedValue(null);

    const response = await requestApp(createApp(), {
      path: "/services/Unknown",
    });

    expect(response.status).toBe(404);
    expect(response.body?.error).toContain("Service not found");
  });

  test("POST /services creates a new record when validator passes", async () => {
    const payload = {
      name: "  Premium Fade  ",
      description: "Includes beard trim",
      price: 280,
      duration: 50,
      type: "hair",
    };
    const created = { ...payload, name: "Premium Fade", status: "active" };
    serviceRepoMock.getByName.mockResolvedValueOnce(null);
    serviceRepoMock.create.mockResolvedValueOnce(created);

    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/services",
      body: payload,
    });

    expect(response.status).toBe(201);
    expect(serviceRepoMock.getByName).toHaveBeenCalledWith("Premium Fade");
    expect(serviceRepoMock.create).toHaveBeenCalledWith({
      ...payload,
      name: "Premium Fade",
    });
    expect(response.body).toEqual(created);
  });

  test("POST /services prevents duplicates before repository.create", async () => {
    const payload = {
      name: "Premium Fade",
      description: "Includes beard trim",
      price: 280,
      duration: 50,
      type: "hair",
    };
    serviceRepoMock.getByName.mockResolvedValueOnce({ name: "Premium Fade" });

    const response = await requestApp(createApp(), {
      method: "POST",
      path: "/services",
      body: payload,
    });

    expect(response.status).toBe(400);
    expect(response.body?.error).toContain("already exists");
    expect(serviceRepoMock.create).not.toHaveBeenCalled();
  });

  test("PUT /services/:name updates the resource and checks conflicts", async () => {
    const updatePayload = {
      name: "Luxury Fade",
      price: 320,
    };
    const updated = {
      ...updatePayload,
      description: "Updated",
      duration: 45,
      type: "hair",
      status: "active",
    };
    serviceRepoMock.getByName
      .mockResolvedValueOnce({
        name: "Premium Fade",
        description: "Old",
        duration: 45,
        price: 300,
        type: "hair",
        status: "active",
      })
      .mockResolvedValueOnce(null);
    serviceRepoMock.update.mockResolvedValueOnce(updated);

    const response = await requestApp(createApp(), {
      method: "PUT",
      path: "/services/Premium%20Fade",
      body: updatePayload,
    });

    expect(response.status).toBe(200);
    expect(serviceRepoMock.update).toHaveBeenCalledWith(
      "Premium Fade",
      updatePayload
    );
    expect(response.body).toEqual(updated);
  });

  test("DELETE /services/:name deactivates the service", async () => {
    serviceRepoMock.deactivate.mockResolvedValueOnce(true);

    const response = await requestApp(createApp(), {
      method: "DELETE",
      path: "/services/Premium%20Fade",
    });

    expect(response.status).toBe(204);
    expect(serviceRepoMock.deactivate).toHaveBeenCalledWith("Premium Fade");
  });

  test("DELETE /services/:name returns 404 when repository reports no change", async () => {
    serviceRepoMock.deactivate.mockResolvedValueOnce(false);

    const response = await requestApp(createApp(), {
      method: "DELETE",
      path: "/services/Unknown",
    });

    expect(response.status).toBe(404);
    expect(response.body?.error).toContain("Service not found");
  });
});
