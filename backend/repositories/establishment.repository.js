import { Establishment } from "../models/establishment.model";
import { Op } from "sequelize";
const RETURN_ATTRS = ["id", "name", "address", "phone_number"];

export const EstablishmentRepository = {
  async getAll({ page = 1, pageSize = 20, q } = {}) {
    const where = {};
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { address: { [Op.like]: `%${q}%` } },
      ];
    }
    const offset = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
    const limit = Math.min(Math.max(pageSize, 1), 100);
    const { rows, count } = await Establishment.findAndCountAll({
      where,
      attributes: RETURN_ATTRS,
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
    const establishment = await Establishment.findByPk(id, {
      attributes: RETURN_ATTRS,
    });
    if (!establishment) {
      throw new Error("Establishment not found");
    }
    return establishment;
  },
  async create(establishment) {
    const name = String(establishment.name).trim();
    const address = String(establishment.address).trim();
    const phone_number = String(establishment.phone_number).trim();

    if (await Establishment.findOne({ where: { name } })) {
      throw new Error("Establishment name is already in use");
    }

    if (await Establishment.findOne({ where: { address } })) {
      throw new Error("Establishment address is already in use");
    }

    const created = await Establishment.create({
      name,
      address,
      phone_number,
    });

    return created;
  },
  async update(id, establishment) {
    const existing = await Establishment.findByPk(id);
    if (!existing) {
      throw new Error("Establishment not found");
    }
    for (const key of Object.keys(establishment)) {
      if (key in existing && key !== "id") {
        if (existing[key] !== establishment[key]) {
            
          const trimmedValue = String(establishment[key]).trim();
          if (
            key === "name" &&
            (await Establishment.findOne({
              where: { name: trimmedValue },
            }))
          ) {
            throw new Error("Establishment name is already in use");
          }
          if (
            key === "address" &&
            (await Establishment.findOne({
              where: { address: trimmedValue },
            }))
          ) {
            throw new Error("Establishment address is already in use");
          }

          existing[key] = trimmedValue;
        }
      }
    }
    await existing.save();
    return existing;
  },
  async delete(id) {
    const existing = await Establishment.findByPk(id);
    if (!existing) {
      throw new Error("Establishment not found");
    }
    await existing.destroy();
    return;
  },
};
