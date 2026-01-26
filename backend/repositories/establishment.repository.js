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
  async getAll({ page = 1, pageSize = 20, q } = {}) {
    const where = {};
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { street: { [Op.like]: `%${q}%` } },
        { city: { [Op.like]: `%${q}%` } },
        { state: { [Op.like]: `%${q}%` } },
        { postal_code: { [Op.like]: `%${q}%` } },
        { int_number: { [Op.like]: `%${q}%` } },
        { ext_number: { [Op.like]: `%${q}%` } },
        { phone_number: { [Op.like]: `%${q}%` } },
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
    await EstablishmentUtils.cannotBeEmpty(Object.values(establishment));
    const sanitizedAttrs = [];
    for (const key of Object.keys(establishment)) {
      sanitizedAttrs.push(String(establishment[key]).trim());
    }
    await EstablishmentUtils.validateUniqueAttributes(
      Establishment,
      sanitizedAttrs,
    );
    const newEstablishment = await Establishment.create(sanitizedAttrs);
    return newEstablishment;
  },
  async update(id, establishment) {
    const existing = await Establishment.getById(id);
    await EstablishmentUtils.cannotBeEmpty(Object.values(establishment));
    const sanitizedAttrs = [];
    for (const key of Object.keys(establishment)) {
      sanitizedAttrs.push(String(establishment[key]).trim());
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
    const existing = await Establishment.getById(id);
    await existing.destroy();
    return;
  },
};
