import { sequelize } from "../config/database.config.js";
import { DataTypes } from "sequelize";

export const Schedule = sequelize.define(
  "Schedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ),
      allowNull: false,
    },
    establishment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "establishment",
        key: "id",
      },
    },
  },
  {
    tableName: "schedule",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["establishment_id", "day_of_week"],
        name: "unique_schedule_per_establishment_day",
      },
    ],
  },
);
