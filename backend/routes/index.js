import { Router } from "express";
import { sequelize } from "../config/database.demo.js";
import appointmentRoutes from "./appointment.routes.js";
import accountRoutes from "./account.routes.js";
import quoteRouter from "./quotes.routes.js";

const router = Router();

router.get("/robots.txt", (req, res) => {
  res.send("Hola Julián🌹");
});

router.get("/db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      message: "Conexión exitosa a la base de datos",
      database: process.env.DB_NAME || "barberia"
    });
  } catch (error) {
    console.error("Error al conectar:", error);
    res.status(500).json({ error: "Error al conectar con la base de datos" });
  }
});

router.use("/appointments", appointmentRoutes);
router.use("/accounts", accountRoutes);
router.use("/quotes", quoteRouter)

export default router;
