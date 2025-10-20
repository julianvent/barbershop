import "dotenv/config";
import mysql from "mysql2/promise";

// Use mysql2's promise-based pool to support async/await in repositories
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || process.env.db_name || "barberia",
  connectionLimit: 10,
  multipleStatements: false,
});

export { pool };
export default pool;
