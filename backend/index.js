// https://dotenvx.com/ops/
// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import rateLimit from 'express-rate-limit'

import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import { initDB, sequelize } from "./config/database.config.js";
import { createDefaultAdminIfNotExist } from "./config/createDefaultAdmin.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_REQUESTS = process.env.MAX_REQUESTS || 1000
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes"
})

app.use(limiter)
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
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
