import { Service } from "../models/service.model.js";
import { EstablishmentService } from "../models/associations/establishment.service.model.js";
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
  async list({
    page = 1,
    limit = 10,
    q = "",
    sort = "id",
    dir = "ASC",
    establishment_id = null,
  }) {
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

    const sortable = new Set([
      "id",
      "name",
      "price",
      "duration",
      "type",
      "status",
    ]);
    if (!sortable.has(sort)) {
      sort = "name";
    }
    dir = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const options = {
      where,
      attributes: RETURN_ATTRS,
      order: [[sort, dir]],
      limit,
      offset,
    };

    if (establishment_id != null) {
      options.include = [
        {
          model: EstablishmentService,
          as: "establishment_services",
          where: { establishment_id: Number(establishment_id) },
          attributes: [],
          required: true,
        },
      ];
    }

    const { rows, count } = await Service.findAndCountAll(options);
    return {
      data: rows,
      meta: { page, limit, total: count, pages: Math.ceil(count / limit) },
    };
  },

  async getById(id) {
    const existing_service = await Service.findByPk(id, {
      attributes: RETURN_ATTRS,
    });
    if (!existing_service) throw new Error("Service not found");
    return existing_service;
  },

  async create(data) {
    const created = await Service.create(data);
    return Service.findByPk(created.id, {
      attributes: RETURN_ATTRS,
    });
  },

  async update(id, data) {
    await Service.update(data, { where: { id } });
    return this.getById(id);
  },

  async deactivate(id) {
    const [updated] = await Service.update(
      { status: "inactive" },
      { where: { id } },
    );
    return updated > 0;
  },

  async linkToAllEstablishments(serviceId, price, establishments) {
    const links = establishments.map((establishment) => ({
      service_id: serviceId,
      establishment_id: establishment.id,
      price: price,
    }));

    await EstablishmentService.bulkCreate(links, {
      ignoreDuplicates: true,
    });
  },

  async linkToEstablishment(serviceId, price, establishmentId) {
    await EstablishmentService.create({
      service_id: serviceId,
      establishment_id: establishmentId,
      price: price,
    });
  },

  async getByEstablishment(establishmentId, params = {}) {
    const { page = 1, limit = 10, q = "" } = params;
    const offset = (Number(page) - 1) * Number(limit);

    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
            { type: { [Op.like]: `%${q}%` } },
          ],
        }
      : undefined;

    const options = {
      where,
      attributes: RETURN_ATTRS,
      include: [
        {
          model: EstablishmentService,
          as: "establishment_services",
          where: { establishment_id: Number(establishmentId) },
          attributes: ["price"],
          required: true,
        },
      ],
      limit: Number(limit),
      offset,
    };

    const { rows, count } = await Service.findAndCountAll(options);
    return {
      data: rows,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / Number(limit)),
      },
    };
  },
};
