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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const v = this.getDataValue("price");
        return v == null ? null : Number(v);
      },
    },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "service",
    timestamps: false,
    underscored: true,
  },
);
