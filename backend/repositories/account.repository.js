import { Account } from "../models/account.model.js";
import { Op } from "sequelize";
const RETURN_ATTRS = [
    "id_cuenta",
    "correo_electronico",
    "nombre_completo",
    "rol"
];

export const AccountRepository = {
    async getAll({page = 1, pageSize = 20, q } = {}) {
        const where = {};
        if(q) {
            where[Op.or] [
                { nombre_completo: { [Op.like]: `%${q}%`} },
                { correo_electronico: { [Op.like]: `%${q}%`} },
                { numero_telefonico: { [Op.like]: `%${q}%`} }
            ];
        }
        const offset = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
        const limit = Math.min(Math.max(pageSize, 1), 100);
        const {rows, count } = await Account.findAndCountAll({
            where,
            attributes: RETURN_ATTRS,
            offset,
            limit
        })
    
        return {
            data: rows,
            page: Number(page),
            pageSize: limit,
            total: count,
            totalPage: Math.ceil(count/limit)
        };
    },
    async getById(id) {
        const account = await Account.findByPk(id, { attributes: RETURN_ATTRS });
        if(!account){
            throw new Error("Account not found");
        }
        return account;
    },
    async getByEmail(correo_electronico) {
        const account = await Account.findOne({ where: { correo_electronico: correo_electronico }})
        if(!account){
            throw new Error("Account not found");
        }
        return account;
    },
    async create(account) {
        try {
            const correo_electronico = account.correo_electronico.trim().toLowerCase();
            const nombre_completo  = account.nombre_completo.trim();

            if (await Account.findOne({ where: { correo_electronico: correo_electronico } })) {
                throw new Error('El correo ya está en uso');
            }

            if (await Account.findOne({ where: { nombre_completo: nombre_completo } })) {
                throw new Error('El usuario ya está en uso');
            }
            const newAccount = await Account.create({
                nombre_completo: account.nombre_completo,
                correo_electronico: account.correo_electronico,
                contrasena_hash: account.contrasena_hash,
                rol: account.rol,
            });
            return Account.findByPk(newAccount.id_cuenta, { attributes: RETURN_ATTRS });;
        } catch (error) {
            throw error;
        }
    },
    async update(id, account) {
        const existingAccount = await Account.findByPk(id)
        if(!existingAccount){
            throw new Error("Account not found");
        }

        if (await Account.findOne({where: { nombre_completo: account.nombre_completo, id_cuenta: { [Op.ne]: id } }})) {
            throw new Error('The username is already in use.');
        }

        if (await Account.findOne({where: { correo_electronico: account.nombre_completo, id_cuenta: { [Op.ne]: id } }})) {
            throw new Error('The email address is already in use.');
        }
        try {
            await existingAccount.update(account);
            return existingAccount;    
        } catch (error) {
            throw error;
        }
    },
    async delete(id) {
        const existingAccount = await Account.findByPk(id)

        if (!existingAccount) {
            throw new Error("Account not found");
        }
        await existingAccount.destroy();
        return { message: "Account deleted successfully" };
    },

};
