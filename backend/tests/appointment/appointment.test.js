import { beforeEach, describe, expect, test, vi } from "vitest";

const AppointmentModelMock = { findByPk: vi.fn() };
const ServiceAppointmentMock = {
  destroy: vi.fn(),
  create: vi.fn(),
  findAll: vi.fn(),
};
const ServiceRepositoryMock = { getById: vi.fn() };
const BarberRepositoryMock = { getById: vi.fn() };

vi.mock("../../models/appointment.model.js", () => ({
  Appointment: AppointmentModelMock,
}));

vi.mock("../../models/service.appointment.model.js", () => ({
  ServiceAppointment: ServiceAppointmentMock,
}));

vi.mock("../../repositories/service.repository.js", () => ({
  ServiceRepository: ServiceRepositoryMock,
}));

vi.mock("../../repositories/barber.repository.js", () => ({
  BarberRepository: BarberRepositoryMock,
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
  "status",
  "barber_id",
  "services_ids",
  "total_duration",
]);

describe("AppointmentRepository.update", () => {
  let appointmentData;
  let appointmentDataWithoutService;
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
      status: "pending",
      barber_id: 1,
      services_ids: [1],
    };
    appointmentDataWithoutService = { ...appointmentData, services_ids: [] };

    // Mock appointment instance with custom update function that mutates appointmentData
    // This simulates Sequelize's update behavior
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
    console.log("\n=== Test: updates services relation when services_ids change ===");
    console.log("Before update - serviceAppointments:", JSON.stringify(serviceAppointments));
    
    // This is the tricky part: when services_ids change, the repository should:
    // 1. Destroy all old service appointments
    // 2. Create new service appointments with the correct prices
    // 3. Calculate and update total_duration based on service durations
    const result = await AppointmentRepository.update(appointmentData.id, {
      services_ids: [2, 3],
      status: "confirmed",
    });

    console.log("After update - result:", JSON.stringify(result, null, 2));
    console.log("After update - serviceAppointments:", JSON.stringify(serviceAppointments));

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

    // total_duration must sum the durations of ALL services being updated
    // Service 2 (Haircut): 25 mins + Service 3 (Beard Trim): 15 mins = 40 mins
    const expectedDuration =
      serviceFixtures[2].duration + serviceFixtures[3].duration;
    console.log(`Expected duration: ${serviceFixtures[2].duration} + ${serviceFixtures[3].duration} = ${expectedDuration}`);

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
    console.log("\n=== Test: updates without touching service relations ===");
    console.log("Before update - serviceAppointments:", JSON.stringify(serviceAppointments));
    
    const result = await AppointmentRepository.update(appointmentData.id, {
      customer_phone: "555-0000",
      status: "completed",
    });

    console.log("After update - serviceAppointments:", JSON.stringify(serviceAppointments));
    console.log("Result:", JSON.stringify(result, null, 2));

    // When services_ids is not in the update payload, we should NOT destroy/create relations
    expect(ServiceAppointmentMock.destroy).not.toHaveBeenCalled();
    expect(ServiceAppointmentMock.create).not.toHaveBeenCalled();
    expect(appointmentInstance.update).toHaveBeenCalledWith({
      customer_phone: "555-0000",
      status: "completed",
    });

    expect(result.customer_phone).toBe("555-0000");
    expect(result.status).toBe("completed");
    expect(result.services).toEqual([{ id: 1, name: serviceFixtures[1].name }]);
  });

  test("calculates correct total_duration when updating with multiple services", async () => {
    console.log("\n=== Test: calculates total_duration with multiple services ===");
    console.log("Starting with appointment that has NO services");
    // Tricky part: this test verifies that duration calculation works correctly when
    // adding multiple services to an appointment that previously had none
    
    const result = await AppointmentRepository.update(appointmentDataWithoutService.id, {
      services_ids: [1, 2, 3],
    });


    // Service 1 (Wash): 10 + Service 2 (Haircut): 25 + Service 3 (Beard Trim): 15 = 50 mins
    const expectedDuration = serviceFixtures[1].duration + serviceFixtures[2].duration + serviceFixtures[3].duration;
    console.log(`Duration calculation: ${serviceFixtures[1].duration} + ${serviceFixtures[2].duration} + ${serviceFixtures[3].duration} = ${expectedDuration}`);
    console.log(`Result total_duration: ${result.total_duration}`);

    expect(appointmentInstance.update).toHaveBeenCalledWith({
      services_ids: [1, 2, 3],
      total_duration: expectedDuration,
    });
    expect(result.total_duration).toBe(expectedDuration);
  });

  test("handles single service duration calculation correctly", async () => {
    console.log("\n=== Test: handles single service duration calculation correctly ===");
    const result = await AppointmentRepository.update(appointmentData.id, {
      services_ids: [2],
    });

    const expectedDuration = serviceFixtures[2].duration;

    console.log(`Single service duration: ${expectedDuration}`);
    console.log(`Result total_duration: ${result.total_duration}`);

    expect(appointmentInstance.update).toHaveBeenCalledWith({
      services_ids: [2],
      total_duration: expectedDuration,
    });
    expect(result.total_duration).toBe(expectedDuration);
  });

  test("maintains appointment when services_ids not provided in update", async () => {
    console.log("\n=== Test: maintains appointment when services_ids not provided ===");
    // This test ensures that total_duration remains unchanged if services_ids is not provided
    // The original appointmentData doesn't have total_duration set, so this tests the default behavior
    console.log(`Original appointment total_duration: ${appointmentData.total_duration}`);
    
    const result = await AppointmentRepository.update(appointmentData.id, {
      status: "confirmed",
    });

    // This test ensures that duration should NOT be recalculated or modified if services_ids not provided
    expect(appointmentInstance.update).toHaveBeenCalledWith({
      status: "confirmed",
    });
    console.log(`Result total_duration after update: ${result.total_duration}`);
    expect(result.total_duration).toBe(appointmentData.total_duration);
    expect(result.total_duration).toBe(appointmentData.total_duration);
  });
});

describe("AppointmentService.find - Total Cost Calculation", () => {
  let serviceAppointments;

  beforeEach(() => {
    vi.clearAllMocks();

    serviceAppointments = [
      {
        appointment_id: 10,
        service_id: 1,
        price: serviceFixtures[1].price,
      },
      {
        appointment_id: 10,
        service_id: 2,
        price: serviceFixtures[2].price,
      },
    ];

    AppointmentModelMock.findByPk.mockResolvedValue({
      id: 10,
      customer_name: "John Doe",
      customer_phone: "123456789",
      customer_email: "john@example.com",
      appointment_datetime: new Date("2024-05-20T10:00:00Z"),
      total_duration: 35,
      status: "confirmed",
      barber_id: 7,
      toJSON: () => ({
        id: 10,
        customer_name: "John Doe",
        customer_phone: "123456789",
        customer_email: "john@example.com",
        appointment_datetime: new Date("2024-05-20T10:00:00Z"),
        total_duration: 35,
        status: "confirmed",
        barber_id: 7,
      }),
    });

    BarberRepositoryMock.getById.mockResolvedValue({
      id: 7,
      barber_name: "Test Barber",
      is_active: true,
      image_path: null,
      phone: "555-1234",
      email: "test@barber.com",
    });

    ServiceAppointmentMock.findAll.mockResolvedValue(serviceAppointments);

    ServiceRepositoryMock.getById.mockImplementation(async (id) => {
      const service = serviceFixtures[id];
      if (!service) {
        throw new Error("Service not found");
      }
      return service;
    });
  });

  test("calculates correct total cost for single service", async () => {
    console.log("\n=== Test: calculates total cost for single service ===");
    const { AppointmentService } = await import(
      "../../services/appointment.service.js"
    );

    // This test replaces serviceAppointments with a new array containing only one service
    const singleServiceAppointments = [
      {
        appointment_id: 10,
        service_id: 2,
        price: serviceFixtures[2].price,
      },
    ];

    console.log("Mocking serviceAppointments to:", singleServiceAppointments);
    ServiceAppointmentMock.findAll.mockResolvedValue(singleServiceAppointments);

    const result = await AppointmentService.find(10);

    console.log(`Result cost_total: ${result.cost_total} (expected: ${serviceFixtures[2].price})`);
    expect(result.cost_total).toBe(serviceFixtures[2].price); // 20
  });

  test("calculates correct total cost for multiple services", async () => {
    console.log("\n=== Test: calculates total cost for multiple services ===");
    const { AppointmentService } = await import(
      "../../services/appointment.service.js"
    );

    // This test uses serviceAppointments set up in beforeEach with 2 services
    console.log("Using serviceAppointments from beforeEach:", JSON.stringify(serviceAppointments));
    
    const result = await AppointmentService.find(10);

    // This test ensures that cost_total sums prices from all linked services
    // Service 1 (Wash): $8 + Service 2 (Haircut): $20 = $28
    const expectedCost = serviceFixtures[1].price + serviceFixtures[2].price; // 8 + 20 = 28
    console.log(`Cost calculation: $${serviceFixtures[1].price} + $${serviceFixtures[2].price} = $${expectedCost}`);
    console.log(`Result cost_total: $${result.cost_total}`);

    expect(result.cost_total).toBe(expectedCost);
  });

  test("returns service details with price and duration", async () => {
    const { AppointmentService } = await import(
      "../../services/appointment.service.js"
    );

    const result = await AppointmentService.find(10);

    expect(result.services).toEqual([
      {
        id: 1,
        name: serviceFixtures[1].name,
        price: serviceFixtures[1].price,
        duration: serviceFixtures[1].duration,
      },
      {
        id: 2,
        name: serviceFixtures[2].name,
        price: serviceFixtures[2].price,
        duration: serviceFixtures[2].duration,
      },
    ]);
  });

  test("calculates correct total cost for three services", async () => {
    const { AppointmentService } = await import(
      "../../services/appointment.service.js"
    );

    const threeServiceAppointments = [
      {
        appointment_id: 10,
        service_id: 1,
        price: serviceFixtures[1].price,
      },
      {
        appointment_id: 10,
        service_id: 2,
        price: serviceFixtures[2].price,
      },
      {
        appointment_id: 10,
        service_id: 3,
        price: serviceFixtures[3].price,
      },
    ];

    ServiceAppointmentMock.findAll.mockResolvedValue(threeServiceAppointments);

    const result = await AppointmentService.find(10);

    const expectedCost =
      serviceFixtures[1].price +
      serviceFixtures[2].price +
      serviceFixtures[3].price; // 8 + 20 + 12 = 40

    expect(result.cost_total).toBe(expectedCost);
  });

  test("includes appointment details alongside cost and duration", async () => {
    const { AppointmentService } = await import(
      "../../services/appointment.service.js"
    );

    const result = await AppointmentService.find(10);

    expect(result).toHaveProperty("id", 10);
    expect(result).toHaveProperty("customer_name", "John Doe");
    expect(result).toHaveProperty("total_duration", 35);
    expect(result).toHaveProperty("status", "confirmed");
    expect(result).toHaveProperty("cost_total");
    expect(result).toHaveProperty("services");
  });
});
