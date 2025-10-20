import { AccountService } from "../services/account.service.js";


export const AccountController = {
    async getAll(req, res) {
        try {
            const accounts = await AccountService.list(req.query);
            res.status(200).json(accounts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }  
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const account = await AccountService.find(id);            
            res.status(200).json(account);
        } catch (error) {
            const code = error.code === "NOT_FOUND" ? 404 : 500;
            res.status(code).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const accountData = req.body;
            const newAccount = await AccountService.create(accountData);
            res.status(201).json(newAccount);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const accountData = req.body;
            const updatedAccount = await AccountService.update(id, accountData);
            res.status(200).json(updatedAccount);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {  
            const { id } = req.params;
            await AccountService.delete(id);
            res.status(204).send();
        } catch (error) {
            const code = error.code === "NOT_FOUND" ? 404 : 500;
            res.status(code).json({ message: error.message });
        }
    },
    async login(req, res){
        try {
            const { correo_electronico, contrasena } = req.body;
            const verifiedAccount = await AccountService.login(correo_electronico, contrasena);
            return res.status(200).json(verifiedAccount);
        } catch (error) {
            const code = error.status || 401; 
            res.status(code).json({ message: error.message });
        }
    }
};