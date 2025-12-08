import { sequelize } from "./database.config.js";
import { seedDatabase } from "../utils/seed.utils.js";

async function runSeed() {
  try {
    console.log(" Starting database seed script...\n");

    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established\n");

    // Run seed with force option to clear existing data
    await seedDatabase(sequelize, { seedDB: true });

    console.log("\n Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n Seed failed:", error);
    process.exit(1);
  }
}

runSeed();
