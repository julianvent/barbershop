import { Sequelize } from "sequelize";
import "dotenv/config";
import mysql from "mysql2/promise";
import { seedDatabase } from "../utils/seed.utils.js";

const DB_NAME = process.env.DB_NAME || "barberia";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const TIMEOUT = process.env.TIMEOUT || 20000;
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: true,
});

export async function initDB() {
  try {
    console.log(`Timeout of ${TIMEOUT}ms`);
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    await createDatabaseIfNotExists();
    await seedDatabase(sequelize);
    await sequelize.authenticate();
    console.log("Database connection OK");
  } catch (err) {
    console.error("Error connecting to database:", err.message);
    process.exit(1);
  }
}

async function createDatabaseIfNotExists() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database '${DB_NAME}' created or already exists`);
  } catch (err) {
    console.error("Error creating database:", err.message);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


