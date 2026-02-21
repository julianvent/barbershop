import { sequelize } from "../config/database.config.js";
import { DataTypes } from "sequelize";
import { Establishment } from "./establishment.model.js";

export const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const v = this.getDataValue("price");
        return v == null ? null : Number(v);
      },
    },
    Establishment_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null for deactivated services
      references: {
        model: Establishment,
        key: "id",
      },
    },
  },
  {
    tableName: "service",
    timestamps: false,
    underscored: true,
  },
);
