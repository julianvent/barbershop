import { sequelize } from "../config/database.config.js";
import { DataTypes } from "sequelize";

export const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    tableName: "service",
    timestamps: false,
    underscored: true,
  },
);
