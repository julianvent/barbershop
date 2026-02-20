import { Service } from "../models/service.model.js";
import { Establishment } from "../models/establishment.model.js";
import { Op } from "sequelize";

const RETURN_ATTRS = [
  "id",
  "name",
  "description",
  "duration",
  "type",
  "price",
  "Establishment_id",
];

export const ServiceRepository = {
  async list({
    page = 1,
    limit = null,
    q = "",
    sort = "id",
    dir = "ASC",
    establishment_id = null,
  }) {
    page = Number(page);
    const limitNum = limit ? Number(limit) : null;
    const offset = limitNum ? (page - 1) * limitNum : 0;

    const where = {
      Establishment_id: { [Op.not]: null },
    };

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { type: { [Op.like]: `%${q}%` } },
      ];
    }

    if (establishment_id != null) {
      where.Establishment_id = Number(establishment_id);
    }

    const sortable = new Set(["id", "name", "duration", "type", "price"]);
    if (!sortable.has(sort)) {
      sort = "name";
    }
    dir = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const options = {
      where,
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "Establishment",
          attributes: ["name"],
        },
      ],
      order: [[sort, dir]],
      offset,
    };

    if (limitNum != null) {
      options.limit = limitNum;
    }

    const { rows, count } = await Service.findAndCountAll(options);

    return {
      data: rows,
      meta: {
        page,
        limit: limitNum,
        total: count,
        pages: limitNum ? Math.ceil(count / limitNum) : 1,
      },
    };
  },

  async getById(id, establishmentId = null) {
    const where = {};

    if (establishmentId != null) {
      where.Establishment_id = Number(establishmentId);
    }

    const existing_service = await Service.findOne({
      where: { id, ...where },
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "Establishment",
          attributes: ["name"],
        },
      ],
    });

    if (!existing_service) throw new Error("Service not found");

    return existing_service;
  },

  async createWithLinks(data, establishment_id = null, isAdmin = false) {
    if (!establishment_id) {
      throw new Error("Establishment ID is required");
    }

    const serviceData = {
      ...data,
      Establishment_id: Number(establishment_id),
      price: data.price,
    };

    const created = await Service.create(serviceData);

    return Service.findByPk(created.id, {
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "Establishment",
          attributes: ["name"],
        },
      ],
    });
  },

  async update(id, data, establishment_id = null, isAdmin = false) {
    const updateData = { ...data };
    const where = { id };

    if (!isAdmin && establishment_id != null) {
      where.Establishment_id = Number(establishment_id);
    }

    const existing = await Service.findOne({ where });
    if (!existing) {
      throw new Error(
        "Service not found or does not belong to your establishment",
      );
    }

    await Service.update(updateData, { where: { id } });

    return this.getById(id, establishment_id);
  },

  async deactivate(id, establishment_id = null, isAdmin = false) {
    const where = { id };

    // If not admin, ensure service belongs to the establishment
    if (!isAdmin && establishment_id != null) {
      where.Establishment_id = Number(establishment_id);
    }

    // Remove the establishment relationship (soft delete)
    // This makes the service invisible in lists but preserves it for historical appointments
    const [updated] = await Service.update(
      { Establishment_id: null },
      { where }
    );
    
    return updated > 0;
  },

  async getByEstablishment(establishmentId, params = {}) {
    const { page = 1, limit = 10, q = "" } = params;
    const offset = (Number(page) - 1) * Number(limit);

    const where = {
      Establishment_id: Number(establishmentId), 
    };

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { type: { [Op.like]: `%${q}%` } },
      ];
    }

    const { rows, count } = await Service.findAndCountAll({
      where,
      attributes: RETURN_ATTRS,
      include: [
        {
          model: Establishment,
          as: "Establishment",
          attributes: ["name"],
        },
      ],
      limit: Number(limit),
      offset,
    });

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
