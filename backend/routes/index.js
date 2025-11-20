import { Router } from "express";
import { sequelize } from "../config/database.demo.js";
import appointmentRoutes from "./appointment.routes.js";
import accountRoutes from "./account.routes.js";
import quoteRouter from "./quotes.routes.js";
import scheduleRoutes from "./schedule.routes.js";
import serviceRoute from "./service.routes.js";
import barberRouter from "./barber.routes.js"

const router = Router();

router.get("/robots.txt", (req, res) => {
  res.send("Hola Julián🌹");
});

router.get("/db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      message: "Database connection successful",
      database: process.env.DB_NAME || "barberia",
    });
  } catch (error) {
    console.error("Connection error:", error);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
});

router.use("/appointments", appointmentRoutes);
router.use("/accounts", accountRoutes);
router.use("/quotes", quoteRouter);
router.use("/schedules", scheduleRoutes);
router.use("/services", serviceRoute);
router.use("/barbers", barberRouter)

export default router;
