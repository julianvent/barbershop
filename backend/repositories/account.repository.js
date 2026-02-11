import { Account } from "../models/account.model.js";
import { Establishment } from "../models/establishment.model.js";
import { Op, col } from "sequelize";
const RETURN_ATTRS = ["id", "email", "full_name", "role", "establishment_id", [col("establishment.name"), "establishment_name"]];

export const AccountRepository = {
  async getAll({ page = 1, pageSize = 20, q, establishment_id } = {}) {
    const where = {};
    if (q) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
      ];
    }
    if (establishment_id) {
      where.establishment_id = establishment_id;
    }
    const offset = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
    const limit = Math.min(Math.max(pageSize, 1), 100);
    const { rows, count } = await Account.findAndCountAll({
      where,
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "establishment",
          attributes: [],
          required: false,
        },
      ],
      offset,
      limit,
      order: [["id", "ASC"]],
    });

    return {
      data: rows,
      page: Number(page),
      pageSize: limit,
      total: count,
      totalPage: Math.ceil(count / limit),
    };
  },
  async getById(id) {
    const account = await Account.findByPk(id, {
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "establishment",
          attributes: [],
          required: false,
        },
      ],
    });
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  },
  async getByEmail(email) {
    const account = await Account.findOne({ where: { email } });
    if (!account) {
      throw new Error("Account not found");
    }
    return account; // includes password_hash for login
  },
  async create(account) {
    const email = String(account.email).trim().toLowerCase();
    const full_name = String(account.full_name).trim();

    if (await Account.findOne({ where: { email } })) {
      throw new Error("Email is already in use");
    }

    if (await Account.findOne({ where: { full_name } })) {
      throw new Error("Username is already in use");
    }

    const created = await Account.create({
      full_name,
      email,
      password_hash: account.password_hash,
      role: account.role,
      establishment_id: account.establishment_id,
    });

    return Account.findByPk(created.id, {
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "establishment",
          attributes: [],
          required: false,
        },
      ],
    });
  },
  async update(id, account) {
    const existingAccount = await Account.findByPk(id);
    if (!existingAccount) {
      throw new Error("Account not found");
    }

    if (
      account.full_name &&
      (await Account.findOne({
        where: { full_name: account.full_name, id: { [Op.ne]: id } },
      }))
    ) {
      throw new Error("The username is already in use.");
    }

    if (
      account.email &&
      (await Account.findOne({
        where: { email: account.email, id: { [Op.ne]: id } },
      }))
    ) {
      throw new Error("The email address is already in use.");
    }

    const payload = {};
    if (account.full_name !== undefined) payload.full_name = account.full_name;
    if (account.email !== undefined)
      payload.email = String(account.email).trim().toLowerCase();
    if (account.password_hash !== undefined)
      payload.password_hash = account.password_hash;
    if (account.role !== undefined) payload.role = account.role;
    if (account.establishment_id !== undefined)
      payload.establishment_id = account.establishment_id;

    await existingAccount.update(payload);
    return Account.findByPk(id, {
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "establishment",
          attributes: [],
          required: false,
        },
      ],
    });
  },
  async delete(id) {
    const existingAccount = await Account.findByPk(id);

    if (!existingAccount) {
      throw new Error("Account not found");
    }
    await existingAccount.destroy();
    return { message: "Account deleted successfully" };
  },
};
