import { compare } from "bcrypt";
import { AccountRepository } from "../repositories/account.repository.js";
import { AccountValidator } from "../validators/account.validator.js";
import * as Password from "./password.service.js"
import { signAccessToken } from "./jwt.service.js";

export const AccountService = {
    async list(params) {
        return AccountRepository.getAll(params);
    },

    async find(id) {
        return AccountRepository.getById(id);
    },

    async create(account) {
        AccountValidator.validateCreate(account);
        const contrasena =  account.contrasena;
        
        const contrasena_hash = await Password.hash(contrasena)
        account.contrasena_hash = contrasena_hash
        return AccountRepository.create(account);
        
    },

    async update(id, account) {
        AccountValidator.validateUpdate(account);
        const contrasena =  account.contrasena;

        if(contrasena){
            const contrasena_hash = await Password.hash(contrasena)
            account.contrasena_hash = contrasena_hash
        }
        return AccountRepository.update(id, account);
    },

    async delete(id) {
        return AccountRepository.delete(id);
    },

    async login(email, contrasena) {        
        AccountValidator.validateLogin(email, contrasena);
        const account =  await AccountRepository.getByEmail(email)

        const ok = await Password.compare(contrasena, account.contrasena_hash);
        if (!ok){
            const error = new Error("The password is incorrect.")
            error.status = 401 ;
            throw error;
        }
        
        const plain = account.get ? account.get({ plain: true }) : account;
        const {
        id_cuenta,
            correo_electronico,
            nombre_completo,
            rol
        } = plain;

        const token = signAccessToken({ sub: account.id_cuenta, rol});

        return {
            user: { id_cuenta, correo_electronico: correo_electronico, nombre_completo, rol },
            token,
        };
    }
};