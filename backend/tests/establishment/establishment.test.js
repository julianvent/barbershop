import express from "express";
import { test, vi } from "vitest";
import { requestApp } from "../helpers/request.js";

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

vi.mock("../../middlewares/require.auth.middleware.js", () => ({
  default: (req, res, next) => next(),
}));

vi.mock("../../middlewares/require.admin.middleware.js", () => ({
  requireRole: () => (req, res, next) => next(),
}));

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
  establishmentRepoMock.getAll.mockResolvedValueOnce(
    ROWS_ESTABLISHMENT.map((establishment, index) => ({
      ...establishment,
      Account: ROWS_ACCOUNT[index],
    })),
  );
  const app = createApp();
  const res = await requestApp(app).get("/establishments").expect(200);
  console.log(res.body);
  expect(res.body.length).toBe(2);
  expect(res.body[0].Account).toHaveProperty("username");
  expect(res.body[0].Account.username).toBe("user1");
  expect(res.body[1].Account.username).toBe("user2");
});
