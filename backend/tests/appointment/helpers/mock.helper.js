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
  update: vi.fn(async (id, appointment) => {
    const existingAppointment = await AppointmentModelMock.findByPk(id);
    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.services_ids && appointment.services_ids.length > 0) {
      let sumDuration = 0;
      const services = [];

      for (const serviceId of appointment.services_ids) {
        const service = await ServiceRepositoryMock.getById(serviceId);
        sumDuration += service.duration;
        services.push(service);
      }

      if (appointment.total_duration == null) {
        appointment.total_duration = sumDuration;
      }

      await ServiceAppointmentMock.destroy({
        where: { appointment_id: id },
      });

      for (const service of services) {
        await ServiceAppointmentMock.create({
          service_id: service.id,
          appointment_id: id,
          price: service.price,
        });
      }
    }

    await existingAppointment.update(appointment);

    const updatedServices = await ServiceAppointmentMock.findAll({
      where: { appointment_id: id },
    });
    const serviceDetails = await Promise.all(
      updatedServices.map(async (sa) => {
        const service = await ServiceRepositoryMock.getById(sa.service_id);
        return { id: service.id, name: service.name };
      })
    );

    return {
      ...existingAppointment.toJSON(),
      services: serviceDetails,
    };
  }),
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
  vi.doMock("../../../repositories/appointment.repository.js", () => ({
    AppointmentRepository: appointmentRepoMock,
  }));

  vi.doMock("../../../services/appointment.service.js", () => ({
    AppointmentService: {
      async cancel(id) {
        const appointment = await appointmentRepoMock.getById(String(id));
        if (!appointment) {
          throw new Error("Appointment not found");
        }

        return appointmentRepoMock.update(String(id), {
          status: "cancelled",
        });
      },
    },
  }));

  vi.doMock("../../../middlewares/require.auth.middleware.js", () => ({
    default: (req, res, next) => next(),
  }));

  vi.doMock("../../../middlewares/require.optional.auth.middleware.js", () => ({
    default: (req, res, next) => {
      req.user = null;
      next();
    },
  }));

  vi.doMock("../../../middlewares/require.admin.middleware.js", () => ({
    requireRole: () => (req, res, next) => next(),
  }));

  vi.doMock(
    "../../../middlewares/require.property.appointment.middleware.js",
    () => ({
      propertyAppointment: (req, res, next) => next(),
    })
  );

  vi.doMock("../../../middlewares/require.property.middleware.js", () => ({
    property: () => (req, res, next) => next(),
  }));

  vi.doMock("../../../config/upload.images.js", () => ({
    uploadAppointmentImage: {
      any: () => (req, res, next) => next(),
    },
  }));
}

// Setup mocks for unit tests (repository/service)
export function setupAppointmentUnitMocks() {
  vi.doMock("../../../models/appointment.model.js", () => ({
    Appointment: AppointmentModelMock,
  }));

  vi.doMock("../../../models/service.appointment.model.js", () => ({
    ServiceAppointment: ServiceAppointmentMock,
  }));

  vi.doMock("../../../repositories/service.repository.js", () => ({
    ServiceRepository: ServiceRepositoryMock,
  }));

  vi.doMock("../../../repositories/barber.repository.js", () => ({
    BarberRepository: BarberRepositoryMock,
  }));

  vi.doMock("../../../repositories/appointment.repository.js", () => ({
    AppointmentRepository: AppointmentRepositoryMock,
  }));
}
