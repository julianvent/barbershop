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
    const services = await seedService(Service, t);
    const barbers = await seedBarber(Barber, t);
    const accounts = await seedAccount(Account, t);
    const establishments = await seedEstablishment(Establishment, accounts, t);
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
 * Seed services
 */
async function seedService(Service, t) {
  const services = await Service.bulkCreate(
    [
      {
        name: "Corte de Cabello",
        description: "Corte de cabello clásico o moderno, incluye lavado",
        price: 15.0,
        duration: 30,
        type: "haircut",
        status: "active",
      },
      {
        name: "Arreglo de Barba",
        description: "Recorte y perfilado de barba con navaja",
        price: 10.0,
        duration: 20,
        type: "beard",
        status: "active",
      },
      {
        name: "Combo Corte + Barba",
        description: "Corte de cabello completo más arreglo de barba",
        price: 22.0,
        duration: 45,
        type: "combo",
        status: "active",
      },
      {
        name: "Coloración de Cabello",
        description: "Aplicación de color para cabello, incluye asesoría",
        price: 40.0,
        duration: 60,
        type: "coloring",
        status: "active",
      },
    ],
    { transaction: t },
  );
  console.log(`✓ Created ${services.length} services`);
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
  for (let name of teamName) {
    const barber = await Barber.create(
      {
        barber_name: name,
        image_path: "/assets/images/monkeyBarber.png",
        is_active: true,
        phone: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: `${teamNameEmail[teamName.indexOf(name)]}@barbershop.com`,
      },
      { transaction: t },
    );
    barbers.push(barber);
  }

  const keffBarber = await Barber.create(
    {
      barber_name: "KEVIN SEBASTIÁN FRIAS GARCÍA",
      image_path: "/assets/images/monkeyBarberKeff.jpg",
      is_active: true,
      phone: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `kevin.sebastian.frias.garcia@barbershop.com`,
    },
    { transaction: t },
  );
  barbers.push(keffBarber);

  console.log(`✓ Created ${barbers.length} barbers`);
  return barbers;
}

/**
 * Seed establishments linked to accounts
 */
async function seedEstablishment(Establishment, accounts, t) {
  const establishmentsData = [
    {
      name: "Downtown Barber Shop",
      street: "123 Main St",
      city: "Mexico City",
      state: "CDMX",
      postal_code: "06500",
      phone_number: `555000${Math.floor(1000 + Math.random() * 9000)}`,
      image_path: "/assets/images/barbershop.png",
      account_id: accounts[0]?.id,
    },
    {
      name: "Uptown Cuts",
      street: "456 Elm Ave",
      city: "Mexico City",
      state: "CDMX",
      postal_code: "06600",
      phone_number: `555001${Math.floor(1000 + Math.random() * 9000)}`,
      account_id: accounts[1]?.id,
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
 * Seed accounts
 */
async function seedAccount(Account, t) {
  const accountsData = [
    {
      full_name: "Carlos Receptionist",
      email: "carlos.recep@barbershop.com",
      password: "recep123",
      role: "receptionist",
    },
    {
      full_name: "Ana Receptionist",
      email: "ana.recep@barbershop.com",
      password: "recep123",
      role: "receptionist",
    },
    {
      full_name: "Sebastian Barber",
      email: "sebastian@barbershop.com",
      password: "barber123",
      role: "barber",
    },
    {
      full_name: "Kevin Barber",
      email: "kevin@barbershop.com",
      password: "barber123",
      role: "barber",
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

  console.log(`✓ Created ${accounts.length} accounts`);
  return accounts;
}

/**
 * Seed appointments with GMT-06:00 timezone consistency
 *
 * Converts all appointment datetimes to GMT-06:00 format before saving
 * to ensure consistent timezone handling across the database
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
    {
      customer_name: "Juan Pérez",
      customer_phone: "5551234567",
      customer_email: "juan.perez@email.com",
      appointment_datetime: new Date("2024-12-02T10:00:00"),
      total_duration: 30,
      status: "confirmed",
      barber_id: barbers[0].id,
      services: [services[0]], // Corte de Cabello
    },
    {
      customer_name: "María García",
      customer_phone: "5552345678",
      customer_email: "maria.garcia@email.com",
      appointment_datetime: new Date("2024-12-02T14:30:00"),
      total_duration: 45,
      status: "confirmed",
      barber_id: barbers[1].id,
      services: [services[2]], // Combo
    },
    {
      customer_name: "Carlos López",
      customer_phone: "5553456789",
      customer_email: "carlos.lopez@email.com",
      appointment_datetime: new Date("2024-12-03T11:00:00"),
      total_duration: 20,
      status: "pending",
      barber_id: barbers[2].id,
      services: [services[1]], // Barba
    },
    {
      customer_name: "Ana Martínez",
      customer_phone: "5554567890",
      customer_email: "ana.martinez@email.com",
      appointment_datetime: new Date("2024-12-03T16:00:00"),
      total_duration: 50,
      status: "confirmed",
      barber_id: barbers[3].id,
      services: [services[0], services[1]], // Corte + Barba
    },
    {
      customer_name: "Roberto Sánchez",
      customer_phone: "5555678901",
      customer_email: "roberto.sanchez@email.com",
      appointment_datetime: new Date("2024-12-04T09:30:00"),
      total_duration: 30,
      status: "pending",
      barber_id: barbers[4].id,
      services: [services[0]], // Corte
    },
  ];

  const appointments = [];
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

    // Create service_appointment records
    for (const service of appointmentServices) {
      await ServiceAppointment.create(
        {
          appointment_id: appointment.id,
          service_id: service.id,
          price: service.price,
        },
        { transaction: t },
      );
    }

    appointments.push(appointment);
  }

  console.log(`✓ Created ${appointments.length} appointments (GMT-06:00)`);
  return appointments;
}
