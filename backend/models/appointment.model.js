import { sequelize } from "../config/database.demo.js";
//import { sequelize } from "../../config/database.demo.js";
import { DataTypes } from "sequelize";

export const Appointment = sequelize.define(
  "Cita",
  {
    id_cita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    numero_telefonico_cliente: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    fecha_hora_cita: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duracion_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "confirmada",
        "cancelada",
        "completada"
      ),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  { tableName: "cita", timestamps: false, underscored: true }
);
