import { sequelize } from "../config/database.demo.js";
import { DataTypes } from "sequelize";

export const ServiceAppointment = sequelize.define(
    "ServiceAppointment",
    {
        appointment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "appointment",
                key: "id"
            }
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "service",
                key: "id"
            }
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            get() {
                const v = this.getDataValue("price");
                return v == null ? null : Number(v);
            },
        }
    },
    { tableName: "service_appointment", timestamps: false, underscored: true}
);