import { Establishment } from "../models/establishment.model.js";
import { Op } from "sequelize";
import { EstablishmentUtils } from "../utils/establisment.utils.js";
import { Account } from "../models/account.model.js";
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
  async getAll({
    establishmentId = null,
    sort = "ASC",
    offset = 0,
    limit = 10,
    q = null,
  } = {}) {
    const where = {};
    if (establishmentId != null) where.id = establishmentId;
    if (q != null) {
      const query = `%${q.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: query } },
        { street: { [Op.like]: query } },
        { city: { [Op.like]: query } },
        { postal_code: { [Op.like]: query } },
      ];
    }

    const order = [["name", sort]];

    const options = {
      where,
      order,
    };

    if (offset != null) options.offset = offset;
    if (limit != null) options.limit = limit;

    return Establishment.findAndCountAll(options);
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
    await EstablishmentUtils.cannotBeEmpty(Object.values(establishment));
    const sanitizedAttrs = {};
    for (const key of Object.keys(establishment)) {
      sanitizedAttrs[key] = String(establishment[key]).trim();
    }
    await EstablishmentUtils.validateUniqueAttributes(
      Establishment,
      sanitizedAttrs,
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
    return;
  },
};
