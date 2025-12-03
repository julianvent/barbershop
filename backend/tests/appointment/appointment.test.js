import { beforeEach, describe, expect, test, vi } from "vitest";

const AppointmentModelMock = { findByPk: vi.fn() };
const ServiceAppointmentMock = {
  destroy: vi.fn(),
  create: vi.fn(),
  findAll: vi.fn(),
};
const ServiceRepositoryMock = { getById: vi.fn() };

vi.mock("../../models/appointment.model.js", () => ({
  Appointment: AppointmentModelMock,
}));

vi.mock("../../models/service.appointment.model.js", () => ({
  ServiceAppointment: ServiceAppointmentMock,
}));

vi.mock("../../repositories/service.repository.js", () => ({
  ServiceRepository: ServiceRepositoryMock,
}));

const { AppointmentRepository } = await import(
  "../../repositories/appointment.repository.js"
);

const serviceFixtures = {
  1: { id: 1, name: "Wash", duration: 10, price: 8 },
  2: { id: 2, name: "Haircut", duration: 25, price: 20 },
  3: { id: 3, name: "Beard Trim", duration: 15, price: 12 },
};

const WRITABLE_FIELDS = new Set([
  "customer_name",
  "customer_phone",
  "customer_email",
  "appointment_datetime",
  "total_duration",
  "status",
  "barber_id",
]);

describe("AppointmentRepository.update", () => {
  let appointmentData;
  let appointmentInstance;
  let serviceAppointments;

  beforeEach(() => {
    vi.clearAllMocks();

    appointmentData = {
      id: 10,
      customer_name: "John Doe",
      customer_phone: "123456789",
      customer_email: "john@example.com",
      appointment_datetime: new Date("2024-05-20T10:00:00Z"),
      total_duration: 30,
      status: "pending",
      barber_id: 7,
    };

    appointmentInstance = {
      ...appointmentData,
      update: vi.fn(async (updates) => {
        for (const [key, value] of Object.entries(updates)) {
          if (WRITABLE_FIELDS.has(key)) {
            appointmentData[key] = value;
          }
        }
        return appointmentInstance;
      }),
      toJSON: () => ({ ...appointmentData }),
    };

    serviceAppointments = [
      {
        appointment_id: appointmentData.id,
        service_id: 1,
        price: serviceFixtures[1].price,
      },
    ];

    AppointmentModelMock.findByPk.mockResolvedValue(appointmentInstance);

    ServiceAppointmentMock.destroy.mockImplementation(async ({ where }) => {
      serviceAppointments = serviceAppointments.filter(
        (sa) => sa.appointment_id !== where.appointment_id
      );
      return 1;
    });

    ServiceAppointmentMock.create.mockImplementation(async (payload) => {
      serviceAppointments.push(payload);
      return payload;
    });

    ServiceAppointmentMock.findAll.mockImplementation(async ({ where }) =>
      serviceAppointments.filter(
        (sa) => sa.appointment_id === where.appointment_id
      )
    );

    ServiceRepositoryMock.getById.mockImplementation(async (id) => {
      const service = serviceFixtures[id];
      if (!service) {
        throw new Error("Service not found");
      }
      return service;
    });
  });

  test("updates services relation when services_ids change", async () => {
    const result = await AppointmentRepository.update(appointmentData.id, {
      services_ids: [2, 3],
      status: "confirmed",
    });

    expect(ServiceAppointmentMock.destroy).toHaveBeenCalledWith({
      where: { appointment_id: appointmentData.id },
    });
    expect(ServiceAppointmentMock.create).toHaveBeenCalledTimes(2);
    expect(ServiceAppointmentMock.create).toHaveBeenCalledWith({
      service_id: 2,
      appointment_id: appointmentData.id,
      price: serviceFixtures[2].price,
    });
    expect(ServiceAppointmentMock.create).toHaveBeenCalledWith({
      service_id: 3,
      appointment_id: appointmentData.id,
      price: serviceFixtures[3].price,
    });

    const expectedDuration =
      serviceFixtures[2].duration + serviceFixtures[3].duration;

    expect(appointmentInstance.update).toHaveBeenCalledWith({
      services_ids: [2, 3],
      status: "confirmed",
      total_duration: expectedDuration,
    });
    expect(serviceAppointments.map((sa) => sa.service_id)).toEqual([2, 3]);
    expect(result.services).toEqual([
      { id: 2, name: serviceFixtures[2].name },
      { id: 3, name: serviceFixtures[3].name },
    ]);
    expect(result.total_duration).toBe(expectedDuration);
  });

  test("updates appointment fields without touching service relations when services_ids omitted", async () => {
    const result = await AppointmentRepository.update(appointmentData.id, {
      customer_phone: "555-0000",
      status: "completed",
    });

    expect(ServiceAppointmentMock.destroy).not.toHaveBeenCalled();
    expect(ServiceAppointmentMock.create).not.toHaveBeenCalled();
    expect(appointmentInstance.update).toHaveBeenCalledWith({
      customer_phone: "555-0000",
      status: "completed",
    });

    expect(result.customer_phone).toBe("555-0000");
    expect(result.status).toBe("completed");
    expect(result.services).toEqual([
      { id: 1, name: serviceFixtures[1].name },
    ]);
  });
});
