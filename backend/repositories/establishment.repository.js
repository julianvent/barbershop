import { Establishment } from "../models/establishment.model.js";
import { Op } from "sequelize";
import { AccountRepository } from "./account.repository.js";

const RETURN_ATTRS = [
  "id",
  "name",
  "street",
  "city",
  "state",
  "postal_code",
  "phone_number",
  "image_path",
  "int_number",
  "ext_number",
];

export const EstablishmentRepository = {
  async list(filters = {}) {
    const {
      name,
      street,
      city,
      state,
      sort = "ASC",
      page = 1,
      limit = 10,
    } = filters;

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

    if (page && limit) {
      options.limit = parseInt(limit, 10);
      options.offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    }

    const establishments = await Establishment.findAll(options);
    return establishments;
  },
  async getById(id) {
    const establishment = await Establishment.findByPk(id, {
      attributes: [...RETURN_ATTRS, "account_id"],
    });
    if (!establishment) {
      throw new Error("Establishment not found");
    }
    if (establishment.account_id) {
      const account = await AccountRepository.getById(establishment.account_id);
      establishment.dataValues.account_name = account.full_name;
    }

    return establishment;
  },
  async create(establishment) {
    try {
      const sanitizedAttrs = {};
      for (const key of Object.keys(establishment)) {
        sanitizedAttrs[key] = String(establishment[key]).trim();
      }
      const newEstablishment = await Establishment.create(sanitizedAttrs);
      return Establishment.findByPk(newEstablishment.id, {
        attributes: RETURN_ATTRS,
      });
    } catch (error) {
      throw new Error("Error creating establishment: " + error.message);
    }
  },
  async update(id, establishment) {
    try {
      const existing = await Establishment.findByPk(id);
      if (!existing) {
        throw new Error("Establishment not found");
      }
      await existing.update(establishment);
      return Establishment.findByPk(existing.id, {
        attributes: RETURN_ATTRS,
      });
    } catch (error) {
      throw new Error("Error updating establishment: " + error.message);
    }
  },
  async delete(id) {
    try {
      const existing = await Establishment.findByPk(id);
      if (!existing) {
        throw new Error("Establishment not found");
      }
      await existing.destroy();
      return { message: "Establishment deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting establishment: " + error.message);
    }
  },
};
