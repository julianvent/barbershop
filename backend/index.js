// https://dotenvx.com/ops/
// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

import { setupRateLimit } from "./middlewares/rate.limit.middleware.js";
import { setupLogging } from "./middlewares/logging.middleware.js";

import { initDB, sequelize } from "./config/database.config.js";
import { createDefaultAdminIfNotExist } from "./config/createDefaultAdmin.js";
import { seed as seedProduction } from "./utils/seed.production.util.js";


const app = express();
const PORT = process.env.PORT || 3000;

setupLogging(app);
setupRateLimit(app);

app.use(cookieParser())
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal error" });
});

app.use("/", routes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

async function startServer() {
  try {
    await initDB();

    await sequelize.sync();
    console.log("Models synchronized");
    await createDefaultAdminIfNotExist();

    await seedProduction();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    console.log("TZ:", process.env.TZ);
    console.log("Now:", new Date().toString());
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
