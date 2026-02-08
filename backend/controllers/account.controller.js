import { AccountService } from "../services/account.service.js";

export const AccountController = {
  async getAll(req, res) {
    try {
      const filters = { ...req.query };

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        filters.establishment_id = req.user.establishment_id;
      }

      const accounts = await AccountService.list(filters);
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
      if (req.user.role != "admin") delete accountData.role;
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
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const verifiedAccount = await AccountService.login(email, password);
      res.cookie("token", verifiedAccount.token);
      res.send();
    } catch (error) {
      const code = error.status || 401;
      res.status(code).json({ message: error.message });
    }
  },
};
