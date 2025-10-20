import { Sequelize } from "sequelize";
import "dotenv/config";
import mysql from "mysql2/promise";

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
    console.log(`Timeout de ${TIMEOUT}`)
    await new Promise(resolve => setTimeout(resolve, TIMEOUT));
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log("Conexión a BD OK");
  } catch (err) {
    console.error("Error conectando a BD:", err.message);
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
    console.log(`Base de datos '${DB_NAME}' creada`);
  } catch (err) {
    console.error("Error al crear la base de datos:", err.message);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
