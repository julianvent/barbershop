import { sequelize } from "../config/database.config.js";
import { DataTypes } from "sequelize";

export const Barber = sequelize.define(
  "Barber",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    barber_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { tableName: "barber" }
);
