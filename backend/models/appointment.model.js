import { sequelize } from "../config/database.config.js";
//import { sequelize } from "../../config/database.config.js";
import { DataTypes } from "sequelize";

export const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customer_phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    appointment_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    barber_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "barber",
        key: "id",
      },
    },
  },
  { tableName: "appointment", timestamps: false, underscored: true }
);
