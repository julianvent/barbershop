import express from "express";
import { expect, test, vi } from "vitest";
import { requestApp } from "../helpers/request.js";

const createMockInstance = (data) => ({
  ...data,
  toJSON: vi.fn().mockReturnValue(data),
  update: vi.fn().mockImplementation(function (newData) {
    Object.assign(this, newData);
    return Promise.resolve(this);
  }),
});

const establishmentRepoMock = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("../../repositories/establishment.repository.js", () => ({
  EstablishmentRepository: establishmentRepoMock,
}));

vi.mock("../../validators/establishment.validator.js", () => ({
  EstablishmentValidator: {
    validateFiltersListEstablishments: vi.fn().mockImplementation((f) => ({
      ...f,
      page: 1,
      limit: 10,
      sort: "ASC",
    })),
    validateCreate: vi.fn().mockResolvedValue(true),
    validateUpdate: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("../../config/upload.images.js", () => ({
  existsImage: vi.fn().mockResolvedValue(true),
  removeImage: vi.fn().mockResolvedValue(true),
  ESTABLISHMENT_UPLOAD_DIR: "mock/dir",
  uploadAppointmentImage: { any: () => (req, res, next) => next() },
}));

vi.mock("../../middlewares/require.auth.middleware.js", () => ({
  default: (req, res, next) => {
    req.user = { sub: 1, role: "admin" };
    next();
  },
}));

vi.mock("../../middlewares/require.admin.middleware.js", () => ({
  requireRole: () => (req, res, next) => next(),
}));

vi.mock(
  "../../middlewares/require.property.establishment.middleware.js",
  () => ({
    isEstablishmentOwner: () => (req, res, next) => next(),
  }),
);

global.generateImageUrl = vi.fn((path) => `http://mock.com/${path}`);

const establishmentRouter = (
  await import("../../routes/establishment.routes.js")
).default;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/establishments", establishmentRouter);
  return app;
}

const ROWS_ESTABLISHMENT = [
  {
    id: 1,
    name: "Establishment 1",
    street: "Street 1",
    city: "City 1",
    state: "State 1",
    postal_code: "12345",
    phone_number: "123-456-7890",
  },
  {
    id: 2,
    name: "Establishment 2",
    street: "Street 2",
    city: "City 2",
    state: "State 2",
    postal_code: "67890",
    phone_number: "098-765-4321",
    ext_number: "A",
    int_number: "101",
  },
];

const ROWS_ACCOUNT = [
  { id: 1, username: "user1", email: "user1@example.com" },
  { id: 2, username: "user2", email: "user2@example.com" },
];

test("GET/ establishments from an Account", async () => {
  establishmentRepoMock.getAll.mockResolvedValueOnce({
    count: ROWS_ESTABLISHMENT.length,
    rows: ROWS_ESTABLISHMENT.map((est) => createMockInstance(est)),
  });

  const app = createApp();
  const res = await requestApp(app, { method: "GET", path: "/establishments" });

  expect(res.status).toBe(200);
  expect(res.body.data.length).toBe(2);
  expect(res.body.meta.total).toBe(2);
});

test("GET/ establishment by ID", async () => {
  const establishmentId = 1;
  establishmentRepoMock.getById.mockResolvedValueOnce(
    createMockInstance(ROWS_ESTABLISHMENT[0]),
  );

  const app = createApp();
  const res = await requestApp(app, {
    method: "GET",
    path: `/establishments/${establishmentId}`,
  });
  expect(res.status).toBe(200);
});

test("POST/ create a new establishment", async () => {
  const newEstablishment = {
    name: "Establishment 3",
    street: "Street 3",
    city: "City 3",
    state: "State 3",
    postal_code: "54321",
    phone_number: "321-654-0987",
  };
  establishmentRepoMock.create.mockResolvedValueOnce({
    id: 3,
    ...newEstablishment,
  });
  const app = createApp();
  const res = await requestApp(app, {
    method: "POST",
    path: "/establishments",
    body: newEstablishment,
  });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id", 3);
  expect(res.body).toHaveProperty("name", "Establishment 3");
});

test("PUT/ update an establishment", async () => {
  const establishmentId = 1;
  const updatedData = { name: "mONKEy 67" };

  const mockInstance = createMockInstance({
    id: establishmentId,
    ...updatedData,
  });

  establishmentRepoMock.getById.mockResolvedValueOnce(mockInstance);

  establishmentRepoMock.update.mockResolvedValueOnce(mockInstance);

  const app = createApp();
  const res = await requestApp(app, {
    method: "PUT",
    path: `/establishments/${establishmentId}`,
    body: updatedData,
  });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("name", "mONKEy 67");
});

test("DELETE/ remove an establishment", async () => {
  const establishmentId = 1;
  const mockInstance = createMockInstance({
    id: establishmentId,
    image_path: "test.jpg",
  });

  establishmentRepoMock.getById.mockResolvedValueOnce(mockInstance);
  establishmentRepoMock.delete.mockResolvedValueOnce(true);

  const app = createApp();
  const res = await requestApp(app, {
    method: "DELETE",
    path: `/establishments/${establishmentId}`,
  });

  expect(res.status).toBe(204);
});
