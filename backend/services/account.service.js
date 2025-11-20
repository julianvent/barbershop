import { AccountRepository } from "../repositories/account.repository.js";
import { AccountValidator } from "../validators/account.validator.js";
import * as Password from "./password.service.js";
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
    const password = account.password;
    const password_hash = await Password.hash(password);
    const payload = {
      full_name: account.full_name,
      email: account.email,
      role: account.role,
      password_hash,
    };
    return AccountRepository.create(payload);
  },

  async update(id, account) {
    AccountValidator.validateUpdate(account);
    const payload = { ...account };
    if (account.password) {
      payload.password_hash = await Password.hash(account.password);
      delete payload.password;
    }
    return AccountRepository.update(id, payload);
  },

  async delete(id) {
    return AccountRepository.delete(id);
  },

  async login(email, password) {
    AccountValidator.validateLogin(email, password);
    const account = await AccountRepository.getByEmail(email);

    const ok = await Password.compare(password, account.password_hash);
    if (!ok) {
      const error = new Error("The password is incorrect.");
      error.status = 401;
      throw error;
    }

    const plain = account.get ? account.get({ plain: true }) : account;
    const { id, role } = plain;

    const token = signAccessToken({ sub: id, role });

    return {
      token,
    };
  },
};
