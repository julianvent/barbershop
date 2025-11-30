export async function seedDatabase(sequelize) {
  try {
    console.log("Starting database seeding...");

    // Lazy-import models to avoid circular imports during module initialization
    const [
      { Service },
      { Barber },
      { Account },
      { ServiceAppointment },
      { Appointment },
    ] = await Promise.all([
      import("../models/service.model.js"),
      import("../models/barber.model.js"),
      import("../models/account.model.js"),
      import("../models/service.appointment.model.js"),
      import("../models/appointment.model.js"),
    ]);

    await sequelize.sync({ alter: false });
    console.log("Database synced");

    // Disable foreign key checks temporarily
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Clear all tables
    await ServiceAppointment.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
    await Appointment.destroy({ where: {}, truncate: true, cascade: true });
    await Service.destroy({ where: {}, truncate: true, cascade: true });
    await Barber.destroy({ where: {}, truncate: true, cascade: true });
    await Account.destroy({ where: {}, truncate: true, cascade: true });

    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Existing data cleared");

    const services = await Service.bulkCreate([
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
    ]);
    console.log(`✓ Created ${services.length} services`);

    // Seed Barber
    const barber = await Barber.create({
      barber_name: "Carlos Mendoza",
      image_path: "/images/barbers/default.jpg",
      is_active: true,
    });
    console.log(`✓ Created barber: ${barber.barber_name}`);
    console.log("\n Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
