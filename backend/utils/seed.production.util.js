// Run this file to seed the database with production data.
import { sequelize } from "../config/database.config.js";
import { Account, Barber, Establishment, Service } from "../models/index.js";

/**
 * Seeds the database with production data for La Barbería
 * Ensures one-time execution by checking if data already exists
 * Uses transactions for data reliability
 *
 * @param {Object} transaction - Optional Sequelize transaction for batch operations
 * @returns {Promise<boolean>} - Returns true if seed was executed, false if data already exists
 */
export async function seed(transaction = null) {
  const existingEst = await Establishment.findOne({
    where: { name: "La Barbería" },
  });

  if (existingEst) {
    console.log("Production seed data already exists. Skipping...");
    return false;
  }

  // Check for admin OUTSIDE transaction to avoid isolation issues
  const adminAccount = await Account.findOne({
    where: { email: process.env.DEFAULT_ADMIN_EMAIL },
  });

  if (!adminAccount) {
    throw new Error(
      "Admin account not found. Please create the default admin account first.",
    );
  }

  const t = transaction || (await sequelize.transaction());
  const shouldCommit = !transaction;

  try {
    const establishment = await Establishment.create(
      {
        name: "La Barbería",
        street: "Av. las Palmas 41",
        city: "Coatzacoalcos",
        state: "Veracruz",
        postal_code: "96558",
        phone_number: "+52 1 921 198 4619",
      },
      { transaction: t },
    );

    const services = await Service.bulkCreate(
      [
        {
          name: "Corte de cabello",
          description: "Corte de cabello clásico para hombres.",
          price: 150,
          duration: 30,
          type: "corte",
          Establishment_id: establishment.id,
        },
        {
          name: "Corte de barba",
          description: "Recorte y arreglo de barba.",
          price: 150,
          duration: 20,
          type: "barba",
          Establishment_id: establishment.id,
        },
        {
          name: "Afeitado",
          description: "Afeitado completo con productos de calidad.",
          price: 150,
          duration: 50,
          type: "afeitado",
          Establishment_id: establishment.id,
        },
        {
          name: "Corte infantil",
          description: "Corte de cabello clásico para niños.",
          price: 150,
          duration: 30,
          type: "corte",
          Establishment_id: establishment.id,
        },
        {
          name: "Tratamiento",
          description: "Tratamiento capilar profesional.",
          price: 350,
          duration: 50,
          type: "tratamiento",
          Establishment_id: establishment.id,
        },
      ],
      { transaction: t },
    );

    const barber = await Barber.create(
      {
        barber_name: "Barbero Principal",
        is_active: true,
        establishment_id: establishment.id,
      },
      { transaction: t },
    );

    if (shouldCommit) {
      await t.commit();
    }

    console.log("Production seed completed.");
    return true;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }

    console.error("Error seeding production database:", error.message);
    throw error;
  }
}
