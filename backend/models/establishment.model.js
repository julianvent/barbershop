import { sequelize } from "../config/database.config.js";
import { DataTypes } from "sequelize";

export const Establishment = sequelize.define(
  "Establishment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters.",
        },
      },
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street cannot be empty" },
      },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "City cannot be empty" },
      },
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "State cannot be empty" },
      },
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Postal code cannot be empty" },
      },
    },
    int_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ext_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Phone number cannot be empty" },
        is: {
          args: /^[0-9+\-() ]+$/i,
          msg: "Phone number can only contain numbers, spaces, and the characters +, -, (, )",
        },
      },
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "account",
        key: "id",
      },
    },
  },
  {
    tableName: "establishment",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "account_id"],
        name: "unique_establishment_per_account",
      },
    ],
  },
);
