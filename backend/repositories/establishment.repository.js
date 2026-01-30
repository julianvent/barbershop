import { Establishment } from "../models/establishment.model.js";
import { Op } from "sequelize";
import { EstablishmentUtils } from "../utils/establisment.utils.js";

const RETURN_ATTRS = [
  "id",
  "name",
  "street",
  "city",
  "state",
  "postal_code",
  "int_number",
  "ext_number",
  "phone_number",
];

export const EstablishmentRepository = {
  async list(filters = {}) {
    const { name, street, city, state, sort = "ASC", page, limit } = filters;

    const where = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (street) {
      where.street = { [Op.iLike]: `%${street}%` };
    }
    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }
    if (state) {
      where.state = { [Op.iLike]: `%${state}%` };
    }

    const options = {
      where,
      attributes: RETURN_ATTRS,
      order: [["name", sort.toUpperCase()]],
    };

    if (page !== undefined && limit !== undefined) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      options.offset = (pageNum - 1) * limitNum;
      options.limit = limitNum;
    }

    const establishments = await Establishment.findAll(options);
    return establishments;
  },
  async getById(id) {
    const establishment = await Establishment.findByPk(id);
    if (!establishment) {
      throw new Error("Establishment not found");
    }
    return establishment;
  },
  async create(establishment) {
    await EstablishmentUtils.cannotBeEmpty(Object.values(establishment));
    const sanitizedAttrs = {};
    for (const key of Object.keys(establishment)) {
      sanitizedAttrs[key] = String(establishment[key]).trim();
    }
    await EstablishmentUtils.validateUniqueAttributes(
      Establishment,
      sanitizedAttrs,
      null
    );
    const newEstablishment = await Establishment.create(sanitizedAttrs);
    return newEstablishment;
  },
  async update(id, establishment) {
    const existing = await Establishment.findByPk(id);
    if (!existing) {
      throw new Error("Establishment not found");
    }
    await EstablishmentUtils.cannotBeEmpty(Object.values(establishment));
    const sanitizedAttrs = {};
    for (const key of Object.keys(establishment)) {
      sanitizedAttrs[key] = String(establishment[key]).trim();
    }
    await EstablishmentUtils.validateUniqueAttributes(
      Establishment,
      sanitizedAttrs,
      id
    );
    Object.assign(existing, sanitizedAttrs);
    await existing.save();
    return existing;
  },
  async delete(id) {
    const existing = await Establishment.findByPk(id);
    if (!existing) {
      throw new Error("Establishment not found");
    }
    await existing.destroy();
    return;b
  },
};
