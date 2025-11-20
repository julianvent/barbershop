import { sequelize } from "../config/database.demo.js";
import { DataTypes } from "sequelize";

export const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters.",
        },
      },
      set(value) {
        this.setDataValue("full_name", String(value).trim());
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Invalid email format" },
      },
      set(value) {
        this.setDataValue("email", String(value).trim().toLowerCase());
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "barber", "receptionist"),
      allowNull: false,
      defaultValue: "receptionist",
    },
  },
  { tableName: "account", timestamps: false, underscored: true }
);
