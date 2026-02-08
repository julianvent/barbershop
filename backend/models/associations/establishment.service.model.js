import { sequelize } from "../../config/database.config.js";
import { DataTypes } from "sequelize";

export const EstablishmentService = sequelize.define(
  "establishment_service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    establishment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "establishments",
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        const v = this.getDataValue("price");
        return v == null ? null : Number(v);
      },
    },
  },
  {
    timestamps: false,
  },
);
