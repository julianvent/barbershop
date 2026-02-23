// This file contains utility functions for seeding the database with testing data.
// To use it in your main application, add inside "scripts" section on the package.json the following lines:
/*
    "seed": "node config/seed.js",
    "force-seed": "node config/seed.js --force"
*/

import { DataTypes } from "sequelize";
import {
  Account,
  Appointment,
  Barber,
  Establishment,
  Schedule,
  Service,
  ServiceAppointment,
} from "../models/index.js";
import { hash } from "../services/password.service.js";
import { formatDateForTimezone } from "../utils/appointment.utils.js";

async function ensureAppointmentImageFinishColumn(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  try {
    const tableDefinition = await queryInterface.describeTable("appointment");
    if (!tableDefinition.image_finish_path) {
      console.log("Adding missing column image_finish_path to appointment...");
      await queryInterface.addColumn("appointment", "image_finish_path", {
        type: DataTypes.STRING(255),
        allowNull: true,
      });
      console.log("Column image_finish_path added");
    }
  } catch (error) {
    // If the table doesn't exist yet, it will be created by sequelize.sync below
    if (error.original?.code !== "ER_NO_SUCH_TABLE") {
      throw error;
    }
  }
}

export async function seedDatabase(
  sequelize,
  options = { seedDB: false, force: false },
) {
  const t = await sequelize.transaction();
  try {
    console.log("Starting database seeding...");

    if (options.force) {
      console.log("Force flag enabled. Resyncing database schema...");
      await sequelize.sync({ force: true, transaction: t });
    } else {
      console.log("Syncing database schema...");
      await sequelize.sync({ alter: true, transaction: t });
    }
    await ensureAppointmentImageFinishColumn(sequelize);
    console.log("Database synced");

    const [
      serviceCount,
      barberCount,
      accountCount,
      scheduleCount,
      establishmentCount,
    ] = await Promise.all([
      Service.count(),
      Barber.count(),
      Account.count(),
      Schedule.count(),
      Establishment.count(),
    ]);

    const hasData =
      serviceCount > 0 ||
      barberCount > 0 ||
      accountCount > 0 ||
      scheduleCount > 0;

    if (hasData && !options.seedDB) {
      console.log("Database already contains data. Skipping seed.");
      console.log(` - Services: ${serviceCount}`);
      console.log(` - Barbers: ${barberCount}`);
      console.log(` - Accounts: ${accountCount}`);
      console.log(` - Schedules: ${scheduleCount}`);
      console.log(` - Establishments: ${establishmentCount}`);
      return;
    }

    if (hasData && options.seedDB) {
      console.log("Force flag enabled. Clearing existing data...");

      // Disable foreign key checks temporarily
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

      // Clear all tables
      await Account.destroy({ where: {}, cascade: true });
      await Establishment.destroy({ where: {}, cascade: true });
      await Schedule.destroy({ where: {}, cascade: true });
      await Barber.destroy({ where: {}, cascade: true });
      await Service.destroy({ where: {}, cascade: true });
      await Appointment.destroy({ where: {}, cascade: true });
      await ServiceAppointment.destroy({ where: {}, cascade: true });

      // Re-enable foreign key checks
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("Existing data cleared");
    }

    // Seed all data
    const adminAccount = await seedAdminAccount(Account, t);
    const establishments = await seedEstablishment(Establishment, t);
    const accounts = await seedAccount(Account, establishments, t);
    const services = await seedService(Service, establishments, t);
    const barbers = await seedBarber(Barber, t);
    for (const est of establishments) {
      await seedSchedulesForEstablishment(Schedule, est.id, t);
    }
    const appointments = await seedAppointment(
      Appointment,
      ServiceAppointment,
      barbers,
      services,
      formatDateForTimezone,
      t,
    );
    console.log("\nDatabase seeding completed successfully!");
    await t.commit();
  } catch (error) {
    console.error("Error seeding database:", error);
    await t.rollback();
    throw error;
  }
}

/**
 * Seed services with establishment assignments and pricing
 * Each service belongs to a specific establishment with its own price
 */
async function seedService(Service, establishments, t) {
  const downtown = establishments.find(
    (e) => e.name === "Downtown Barber Shop",
  );
  const uptown = establishments.find((e) => e.name === "Uptown Cuts");

  const servicesData = [];

  // Downtown Barber Shop services (Premium pricing)
  if (downtown) {
    servicesData.push(
      {
        name: "Corte de Cabello",
        description: "Corte de cabello clásico o moderno, incluye lavado",
        duration: 30,
        type: "haircut",
        price: 18.0,
        Establishment_id: downtown.id,
      },
      {
        name: "Combo Corte + Barba",
        description: "Corte de cabello completo más arreglo de barba",
        duration: 45,
        type: "combo",
        price: 25.0,
        Establishment_id: downtown.id,
      },
      {
        name: "Coloración de Cabello",
        description: "Aplicación de color para cabello, incluye asesoría",
        duration: 60,
        type: "coloring",
        price: 45.0,
        Establishment_id: downtown.id,
      },
    );
  }

  // Uptown Cuts services (Budget-friendly pricing)
  if (uptown) {
    servicesData.push(
      {
        name: "Corte de Cabello",
        description: "Corte de cabello clásico o moderno, incluye lavado",
        duration: 30,
        type: "haircut",
        price: 12.0,
        Establishment_id: uptown.id,
      },
      {
        name: "Arreglo de Barba",
        description: "Recorte y perfilado de barba con navaja",
        duration: 20,
        type: "beard",
        price: 8.0,
        Establishment_id: uptown.id,
      },
      {
        name: "Combo Corte + Barba",
        description: "Corte de cabello completo más arreglo de barba",
        duration: 45,
        type: "combo",
        price: 19.0,
        Establishment_id: uptown.id,
      },
    );
  }

  const services = await Service.bulkCreate(servicesData, { transaction: t });
  console.log(`✓ Created ${services.length} services across establishments`);
  console.log(
    `  - Downtown Barber Shop: Corte ($18), Combo ($25), Coloración ($45)`,
  );
  console.log(`  - Uptown Cuts: Corte ($12), Barba ($8), Combo ($19)`);
  return services;
}

/**
 * Seed barbers
 */
async function seedBarber(Barber, t) {
  const teamName = [
    "SEBASTIÁN DE JESÚS HERNÁNDEZ MONTERO",
    "ADRIÁN HERRERA JERÓNIMO",
    "JOSÉ JULIÁN VENTURA USCANGA",
    "CARLOS ALBERTO CARMONA LÓPEZ",
  ];
  const teamNameEmail = [
    "sebastian.jesus.hernandez.montero",
    "adrian.herrera.jeronimo",
    "jose.julian.ventura.uscanga",
    "carlos.alberto.carmona.lopez",
  ];
  const barbers = [];
  let i = 0;
  let establishment_id;
  for (let name of teamName) {
    if (i % 2 === 0) {
      establishment_id = 1;
    } else {
      establishment_id = 2;
    }
    const barber = await Barber.create(
      {
        barber_name: name,
        image_path: "/assets/images/monkeyBarber.png",
        is_active: true,
        phone: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: `${teamNameEmail[teamName.indexOf(name)]}@barbershop.com`,
        establishment_id: establishment_id,
      },
      { transaction: t },
    );
    barbers.push(barber);
    i++;
  }

  const keffBarber = await Barber.create(
    {
      barber_name: "KEVIN SEBASTIÁN FRIAS GARCÍA",
      image_path: "/assets/images/monkeyBarberKeff.jpg",
      is_active: true,
      phone: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `kevin.sebastian.frias.garcia@barbershop.com`,
      establishment_id: 1,
    },
    { transaction: t },
  );
  barbers.push(keffBarber);

  console.log(`✓ Created ${barbers.length} barbers`);
  return barbers;
}

/**
 * Seed establishments (not linked to receptionist accounts yet)
 */
async function seedEstablishment(Establishment, t) {
  const establishmentsData = [
    {
      name: "Downtown Barber Shop",
      street: "123 Main St",
      city: "Mexico City",
      state: "CDMX",
      postal_code: "06500",
      phone_number: `555000${Math.floor(1000 + Math.random() * 9000)}`,
      image_path: "/assets/images/barbershop.png",
      // account_id will be set later if needed
    },
    {
      name: "Uptown Cuts",
      street: "456 Elm Ave",
      city: "Mexico City",
      state: "CDMX",
      postal_code: "06600",
      phone_number: `555001${Math.floor(1000 + Math.random() * 9000)}`,
      // account_id will be set later if needed
    },
  ];
  const establishments = await Establishment.bulkCreate(establishmentsData, {
    transaction: t,
  });
  console.log(`✓ Create  d ${establishments.length} establishments`);
  return establishments;
}

/**
 * Seed schedules for a specific establishment
 */
async function seedSchedulesForEstablishment(Schedule, establishmentId, t) {
  const schedules = await Schedule.bulkCreate(
    [
      {
        day_of_week: "Monday",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_active: true,
        establishment_id: establishmentId,
      },
      {
        day_of_week: "Tuesday",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_active: true,
        establishment_id: establishmentId,
      },
      {
        day_of_week: "Wednesday",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_active: true,
        establishment_id: establishmentId,
      },
      {
        day_of_week: "Thursday",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_active: true,
        establishment_id: establishmentId,
      },
      {
        day_of_week: "Friday",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_active: true,
        establishment_id: establishmentId,
      },
      {
        day_of_week: "Saturday",
        start_time: "10:00:00",
        end_time: "16:00:00",
        is_active: true,
        establishment_id: establishmentId,
      },
      {
        day_of_week: "Sunday",
        start_time: "00:00:00",
        end_time: "00:00:00",
        is_active: false,
        establishment_id: establishmentId,
      },
    ],
    { transaction: t },
  );
  console.log(
    `✓ Created ${schedules.length} schedules for establishment ${establishmentId}`,
  );
  return schedules;
}

/**
 * Seed receptionist and barber accounts (after establishments are created)
 */
async function seedAccount(Account, establishments, t) {
  const accountsData = [
    {
      full_name: "Carlos Receptionist",
      email: "carlos.recep@barbershop.com",
      password: "recep123",
      role: "receptionist",
      establishment_id: establishments[0].id, // Downtown Barber Shop
    },
    {
      full_name: "Ana Receptionist",
      email: "ana.recep@barbershop.com",
      password: "recep123",
      role: "receptionist",
      establishment_id: establishments[1].id, // Uptown Cuts
    },
    {
      full_name: "Sebastian Barber",
      email: "sebastian@barbershop.com",
      password: "barber123",
      role: "barber",
      establishment_id: establishments[0].id, // Downtown Barber Shop
    },
    {
      full_name: "Kevin Barber",
      email: "kevin@barbershop.com",
      password: "barber123",
      role: "barber",
      establishment_id: establishments[1].id, // Uptown Cuts
    },
  ];

  const accounts = [];
  for (const data of accountsData) {
    const { password, ...accountData } = data;
    const password_hash = await hash(password);

    const account = await Account.create(
      {
        ...accountData,
        password_hash,
      },
      { transaction: t },
    );
    accounts.push(account);
  }

  console.log(`✓ Created ${accounts.length} receptionist/barber accounts`);
  return accounts;
}

/**
 * Seed admin account with global access
 * Admins can manage all establishments and accounts, so they are not linked to a specific establishment
 */
async function seedAdminAccount(Account, t) {
  const adminData = {
    full_name: "Admin User",
    email: "admin@barbershop.com",
    password: "admin123",
    role: "admin",
    // No establishment_id - admins see all establishments
  };

  const { password, ...accountData } = adminData;
  const password_hash = await hash(password);

  const adminAccount = await Account.create(
    {
      ...accountData,
      password_hash,
    },
    { transaction: t },
  );
  console.log(`✓ Created admin account: ${adminAccount.email}`);
  return adminAccount;
}

/**
 * Seed appointments with GMT-06:00 timezone consistency
 *
 * Converts all appointment datetimes to GMT-06:00 format before saving
 * to ensure consistent timezone handling across the database
 *
 * Appointments are distributed across establishments based on barber assignments:
 * - Establishment 1 (Downtown Barber Shop): barbers[0], barbers[2], barbers[4]
 * - Establishment 2 (Uptown Cuts): barbers[1], barbers[3]
 */
async function seedAppointment(
  Appointment,
  ServiceAppointment,
  barbers,
  services,
  formatDateForTimezone,
  t,
) {
  const DB_TIMEZONE = "-06:00";

  const appointmentsData = [
    // Establishment 1 (Downtown Barber Shop) appointments
    {
      customer_name: "Juan Pérez",
      customer_phone: "5551234567",
      customer_email: "juan.perez@email.com",
      appointment_datetime: new Date("2024-12-02T10:00:00"),
      total_duration: 30,
      status: "confirmed",
      barber_id: barbers[0].id, // SEBASTIÁN - Establishment 1
      establishment_id: barbers[0].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Corte de Cabello" &&
            s.Establishment_id === barbers[0].establishment_id,
        ),
      ],
    },
    {
      customer_name: "Carlos López",
      customer_phone: "5553456789",
      customer_email: "carlos.lopez@email.com",
      appointment_datetime: new Date("2024-12-03T11:00:00"),
      total_duration: 30,
      status: "pending",
      barber_id: barbers[2].id, // JOSÉ - Establishment 1
      establishment_id: barbers[2].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Corte de Cabello" &&
            s.Establishment_id === barbers[2].establishment_id,
        ),
      ],
    },
    {
      customer_name: "Roberto Sánchez",
      customer_phone: "5555678901",
      customer_email: "roberto.sanchez@email.com",
      appointment_datetime: new Date("2024-12-04T09:30:00"),
      total_duration: 30,
      status: "pending",
      barber_id: barbers[4].id, // KEVIN - Establishment 1
      establishment_id: barbers[4].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Corte de Cabello" &&
            s.Establishment_id === barbers[4].establishment_id,
        ),
      ],
    },
    {
      customer_name: "Laura Fernández",
      customer_phone: "5556789012",
      customer_email: "laura.fernandez@email.com",
      appointment_datetime: new Date("2024-12-05T15:00:00"),
      total_duration: 45,
      status: "confirmed",
      barber_id: barbers[0].id, // SEBASTIÁN - Establishment 1
      establishment_id: barbers[0].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Combo Corte + Barba" &&
            s.Establishment_id === barbers[0].establishment_id,
        ),
      ],
    },

    // Establishment 2 (Uptown Cuts) appointments
    {
      customer_name: "María García",
      customer_phone: "5552345678",
      customer_email: "maria.garcia@email.com",
      appointment_datetime: new Date("2024-12-02T14:30:00"),
      total_duration: 45,
      status: "confirmed",
      barber_id: barbers[1].id, // ADRIÁN - Establishment 2
      establishment_id: barbers[1].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Combo Corte + Barba" &&
            s.Establishment_id === barbers[1].establishment_id,
        ),
      ],
    },
    {
      customer_name: "Ana Martínez",
      customer_phone: "5554567890",
      customer_email: "ana.martinez@email.com",
      appointment_datetime: new Date("2024-12-03T16:00:00"),
      total_duration: 50,
      status: "confirmed",
      barber_id: barbers[3].id, // CARLOS - Establishment 2
      establishment_id: barbers[3].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Corte de Cabello" &&
            s.Establishment_id === barbers[3].establishment_id,
        ),
        services.find(
          (s) =>
            s.name === "Arreglo de Barba" &&
            s.Establishment_id === barbers[3].establishment_id,
        ),
      ],
    },
    {
      customer_name: "Diego Ramírez",
      customer_phone: "5557890123",
      customer_email: "diego.ramirez@email.com",
      appointment_datetime: new Date("2024-12-04T13:00:00"),
      total_duration: 30,
      status: "confirmed",
      barber_id: barbers[1].id, // ADRIÁN - Establishment 2
      establishment_id: barbers[1].establishment_id,
      services: [
        services.find(
          (s) =>
            s.name === "Corte de Cabello" &&
            s.Establishment_id === barbers[1].establishment_id,
        ),
      ],
    },
  ];

  const appointments = [];
  let est1Count = 0;
  let est2Count = 0;

  for (const data of appointmentsData) {
    const { services: appointmentServices, ...appointmentData } = data;

    // Convert appointment datetime to GMT-06:00 string format for database storage
    // This ensures consistent timezone representation in the database
    const formattedDateTime = formatDateForTimezone(
      appointmentData.appointment_datetime,
      DB_TIMEZONE,
    );

    // Create appointment with timezone-aware datetime
    const appointment = await Appointment.create(
      {
        ...appointmentData,
        appointment_datetime: formattedDateTime,
      },
      { transaction: t },
    );

    // Create service_appointment records with service prices
    for (const service of appointmentServices) {
      if (!service) {
        console.warn(`Skipping null service for appointment ${appointment.id}`);
        continue;
      }

      await ServiceAppointment.create(
        {
          appointment_id: appointment.id,
          service_id: service.id,
          price: service.price, // Get price directly from Service model
        },
        { transaction: t },
      );
    }

    // Track establishment distribution
    const barber = barbers.find((b) => b.id === appointmentData.barber_id);
    if (barber?.establishment_id === 1) {
      est1Count++;
    } else if (barber?.establishment_id === 2) {
      est2Count++;
    }

    appointments.push(appointment);
  }

  console.log(`✓ Created ${appointments.length} appointments (GMT-06:00)`);
  console.log(`  - Establishment 1 (Downtown): ${est1Count} appointments`);
  console.log(`  - Establishment 2 (Uptown): ${est2Count} appointments`);
  return appointments;
}
