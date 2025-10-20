import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import { initDB, sequelize } from "./config/database.demo.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON request bodies

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Error interno" });
});

app.use("/", routes);


async function startServer() {
  try {
    await initDB();

    await sequelize.sync();
    console.log("Modelos sincronizados");

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
