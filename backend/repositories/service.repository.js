import { Service } from "../models/service.model.js";
import { Op } from "sequelize";

const RETURN_ATTRS = [
  "id",
  "name",
  "description",
  "price",
  "duration",
  "type",
  "status",
];

export const ServiceRepository = {
  async list({ page = 1, limit = 10, q = "", sort = "id", dir = "ASC" }) {
    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;
    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
            { type: { [Op.like]: `%${q}%` } },
          ],
        }
      : undefined;

    const sortable = new Set(["id","name", "price", "duration", "type", "status"]);
    if (!sortable.has(sort)) {
      sort = "name";
    }
    dir = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const { rows, count } = await Service.findAndCountAll({
      where,
      attributes: RETURN_ATTRS,
      order: [[sort, dir]],
      limit,
      offset,
    });
    return {
      data: rows,
      meta: { page, limit, total: count, pages: Math.ceil(count / limit) },
    };
  },

  async getById(id){
      const existing_service = await Service.findByPk(id);
      if(!existing_service)
          throw new Error("Service not found");
      return existing_service;
  },

  async create(data) {
    const created = await Service.create(data);
    return Service.findByPk(created.id, {
      attributes: RETURN_ATTRS,
    });
  },

  async update(serviceName, data) {
    await Service.update(data, { where: { name: serviceName } });
    return this.getByName(serviceName);
  },

  async deactivate(serviceName) {
    const [updated] = await Service.update(
      { status: "inactive" },
      { where: { name: serviceName } }
    );
    return updated > 0;
  },
};
