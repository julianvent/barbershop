import { sequelize } from "../config/database.demo.js";
import { DataTypes } from "sequelize";

export const Account = sequelize.define(
    "Cuenta",
    {
        id_cuenta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_completo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate:{
                notEmpty: { msg: "El nombre no puede estar vacío"},
                len: { args: [2, 100], msg: "El nombre debe tener entre 2 y 100 caracteres."}
            },
            set(value){
                this.setDataValue("nombre_completo", String(value).trim());
            }
        },
        correo_electronico: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate:{
                notEmpty: {msg: "El correo no puede estár vacío"},
                isEmail: { msg: "El correo es inválido"}
            },
            set(value){
                this.setDataValue("correo_electronico", String(value).trim().toLowerCase());
            }    
        },
        contrasena_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },        
        rol: {
            type: DataTypes.ENUM("admin", "barbero", "recepcionista"),
            allowNull: false,
            defaultValue: "recepcionista",
        },
    },
    {tableName: "cuenta", timestamps: false, underscored: true}
);
