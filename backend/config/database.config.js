import { Sequelize } from "sequelize";
import "dotenv/config";
import mysql from "mysql2/promise";

const DB_NAME = process.env.DB_NAME || "barbershop";
const TIMEZONE = "-06:00"; // GMT-6
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const TIMEOUT = process.env.TIMEOUT || 20000;

/**
 * IMPORTANT: To store dates as GMT-6 in the database:
 * Always create dates with explicit timezone offset: new Date("2024-12-03T14:00:00-06:00")
 */
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: console.log,
  timezone: TIMEZONE, // Tells Sequelize to convert UTC to GMT-6 when writing to DB
  dialectOptions: {
    timezone: TIMEZONE, // Sets MySQL session: SET time_zone = '-06:00'
  },
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
    evict: 5000,
  },
});

export async function initDB() {
  try {
    console.log(`Timeout of ${TIMEOUT}ms`);
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    await createDatabaseIfNotExists();
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
    console.log(`Database '${DB_NAME}' created.`);
  } catch (err) {
    console.error("Error creating database:", err.message);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
