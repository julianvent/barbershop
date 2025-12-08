import { vi } from "vitest";

// Repository mocks for client tests
export const appointmentRepoMock = {
  getById: vi.fn(),
  update: vi.fn(),
};

// Model mocks for unit tests
export const AppointmentModelMock = { findByPk: vi.fn() };
export const ServiceAppointmentMock = {
  destroy: vi.fn(),
  create: vi.fn(),
  findAll: vi.fn(),
};
export const ServiceRepositoryMock = { getById: vi.fn() };
export const BarberRepositoryMock = { getById: vi.fn() };
export const AppointmentRepositoryMock = {
  getById: vi.fn(),
  getServiceByAppointmentId: vi.fn(),
  update: vi.fn(),
};

// Service fixtures for testing
export const serviceFixtures = {
  1: { id: 1, name: "Wash", duration: 10, price: 8 },
  2: { id: 2, name: "Haircut", duration: 25, price: 20 },
  3: { id: 3, name: "Beard Trim", duration: 15, price: 12 },
};

export const WRITABLE_FIELDS = new Set([
  "customer_name",
  "customer_phone",
  "customer_email",
  "appointment_datetime",
  "status",
  "barber_id",
  "services_ids",
  "total_duration",
]);

// Setup mocks for client/integration tests (routes/controllers)
export function setupAppointmentMocks() {
  vi.mock("../../../repositories/appointment.repository.js", () => ({
    AppointmentRepository: appointmentRepoMock,
  }));

  vi.mock("../../../middlewares/require.auth.middleware.js", () => ({
    default: (req, res, next) => next(),
  }));

  vi.mock("../../../middlewares/require.optional.auth.middleware.js", () => ({
    default: (req, res, next) => {
      req.user = null;
      next();
    },
  }));

  vi.mock("../../../middlewares/require.admin.middleware.js", () => ({
    requireRole: () => (req, res, next) => next(),
  }));

  vi.mock(
    "../../../middlewares/require.property.appointment.middleware.js",
    () => ({
      propertyAppointment: (req, res, next) => next(),
    })
  );

  vi.mock("../../../middlewares/require.property.middleware.js", () => ({
    property: () => (req, res, next) => next(),
  }));

  vi.mock("../../../config/upload.images.js", () => ({
    uploadAppointmentImage: {
      any: () => (req, res, next) => next(),
    },
  }));
}

// Setup mocks for unit tests (repository/service)
export function setupAppointmentUnitMocks() {
  vi.mock("../../../models/appointment.model.js", () => ({
    Appointment: AppointmentModelMock,
  }));

  vi.mock("../../../models/service.appointment.model.js", () => ({
    ServiceAppointment: ServiceAppointmentMock,
  }));

  vi.mock("../../../repositories/service.repository.js", () => ({
    ServiceRepository: ServiceRepositoryMock,
  }));

  vi.mock("../../../repositories/barber.repository.js", () => ({
    BarberRepository: BarberRepositoryMock,
  }));

  vi.mock("../../../repositories/appointment.repository.js", () => ({
    AppointmentRepository: AppointmentRepositoryMock,
  }));
}
