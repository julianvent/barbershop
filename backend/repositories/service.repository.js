import { Service } from "../models/service.model.js";
import { Establishment } from "../models/establishment.model.js";
import { EstablishmentService } from "../models/associations/establishment.service.model.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database.config.js";

const RETURN_ATTRS = [
  "id",
  "name",
  "description",
  "duration",
  "type",
  "status",
];

const RETURN_ATTRS_WITH_ESTABLISHMENT = [
  "id",
  "name",
  "description",
  "duration",
  "type",
  "status",
];

/**
 * Transform service data to flatten establishment info
 * @param {Object} service - Service instance or plain object
 * @param {Number|null} establishmentId - Optional establishment ID filter
 * @returns {Object} Transformed service data
 */
function transformServiceWithEstablishments(service, establishmentId = null) {
  const serviceData =
    typeof service.toJSON === "function" ? service.toJSON() : service;

  if (
    serviceData.establishment_services &&
    serviceData.establishment_services.length > 0
  ) {
    serviceData.establishment_services = serviceData.establishment_services.map(
      (es) => {
        if (establishmentId != null) {
          return { price: es.price };
        }

        // When not filtered, return all establishment info
        return {
          price: es.price,
          establishment_id: es.establishment_id || es.establishment?.id,
          establishment_name: es.establishment?.name,
        };
      },
    );

    // If filtered by establishment_id, return single object instead of array
    if (
      establishmentId != null &&
      serviceData.establishment_services.length === 1
    ) {
      serviceData.establishment_services =
        serviceData.establishment_services[0];
    }
  }

  return serviceData;
}

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
    const where = q
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } },
            { type: { [Op.like]: `%${q}%` } },
          ],
        }
      : undefined;

    const sortable = new Set(["id", "name", "duration", "type", "status"]);
    if (!sortable.has(sort)) {
      sort = "name";
    }
    dir = dir?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const options = {
      where,
      attributes: RETURN_ATTRS,
      order: [[sort, dir]],
      offset,
    };

    if (limitNum != null) {
      options.limit = limitNum;
    }

    if (establishment_id != null) {
      options.include = [
        {
          model: EstablishmentService,
          as: "establishment_services",
          where: { establishment_id: Number(establishment_id) },
          attributes: ["price"],
          required: true,
        },
      ];
    } else {
      // Always include establishment services to show prices
      options.include = [
        {
          model: EstablishmentService,
          as: "establishment_services",
          attributes: ["establishment_id", "price"],
          required: false,
          include: [
            {
              model: Establishment,
              as: "establishment",
              attributes: ["id", "name"],
            },
          ],
        },
      ];
    }

    const { rows, count } = await Service.findAndCountAll(options);

    const transformedRows = rows.map((service) =>
      transformServiceWithEstablishments(service, establishment_id),
    );

    return {
      data: transformedRows,
      meta: {
        page,
        limit: limitNum,
        total: count,
        pages: limitNum ? Math.ceil(count / limitNum) : 1,
      },
    };
  },

  async getById(id, establishmentId = null) {
    const options = {
      attributes: RETURN_ATTRS,
      include: [
        {
          model: EstablishmentService,
          as: "establishment_services",
          attributes:
            establishmentId != null
              ? ["price"] // Only price when filtering by establishment
              : ["establishment_id", "price"], // Both when not filtered
          ...(establishmentId == null && {
            include: [
              {
                model: Establishment,
                as: "establishment",
                attributes: ["id", "name"],
              },
            ],
          }),
        },
      ],
    };

    if (establishmentId != null) {
      options.include[0].where = { establishment_id: Number(establishmentId) };
    }

    const existing_service = await Service.findByPk(id, options);
    if (!existing_service) throw new Error("Service not found");

    const serviceData = transformServiceWithEstablishments(
      existing_service,
      establishmentId,
    );

    return serviceData;
  },

  async createWithLinks(data, establishment_id = null, isAdmin = false) {
    const transaction = await sequelize.transaction();

    try {
      const { price, ...serviceData } = data;

      if (!price) {
        throw new Error("Price is required");
      }

      // Create the service without price
      const created = await Service.create(serviceData, { transaction });

      if (establishment_id) {
        await EstablishmentService.create(
          {
            service_id: created.id,
            establishment_id: Number(establishment_id),
            price: price,
          },
          { transaction },
        );
      } else if (isAdmin) {
        // Admin without establishment_id: link to all establishments
        const establishments = await Establishment.findAll({
          attributes: ["id"],
          transaction,
        });

        if (establishments.length > 0) {
          const links = establishments.map((establishment) => ({
            service_id: created.id,
            establishment_id: establishment.id,
            price: price,
          }));

          await EstablishmentService.bulkCreate(links, {
            transaction,
            ignoreDuplicates: true,
          });
        }
      }

      await transaction.commit();

      return Service.findByPk(created.id, {
        attributes: RETURN_ATTRS,
        include: [
          {
            model: EstablishmentService,
            as: "establishment_services",
            attributes:
              establishment_id != null
                ? ["price"]
                : ["establishment_id", "price"],
          },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async update(id, data, establishment_id = null, isAdmin = false) {
    const updateData = { ...data };

    if (updateData.establishment_services) {
      const establishmentServices = Array.isArray(
        updateData.establishment_services,
      )
        ? updateData.establishment_services
        : [updateData.establishment_services];

      if (establishment_id != null) {
        const targetService = establishmentServices.find(
          (es) => es.establishment_id === Number(establishment_id),
        );

        if (targetService && targetService.price !== undefined) {
          await EstablishmentService.update(
            { price: targetService.price },
            {
              where: {
                service_id: id,
                establishment_id: Number(establishment_id),
              },
            },
          );
        }
      } else if (isAdmin) {
        for (const es of establishmentServices) {
          if (es.establishment_id && es.price !== undefined) {
            await EstablishmentService.update(
              { price: es.price },
              {
                where: {
                  service_id: id,
                  establishment_id: Number(es.establishment_id),
                },
              },
            );
          }
        }
      }

      delete updateData.establishment_services;
    }
    // Handle legacy top-level price field
    else if (updateData.price !== undefined) {
      const priceToUpdate = updateData.price;
      delete updateData.price;

      
      if (establishment_id != null) {
        await EstablishmentService.update(
          { price: priceToUpdate },
          {
            where: {
              service_id: id,
              establishment_id: Number(establishment_id),
            },
          },
        );
      } else if (isAdmin) {
        await EstablishmentService.update(
          { price: priceToUpdate },
          { where: { service_id: id } },
        );
      }
    }

    // Update other Service fields
    if (Object.keys(updateData).length > 0) {
      await Service.update(updateData, { where: { id } });
    }

    return this.getById(id, establishment_id);
  },

  async deactivate(id, establishment_id = null) {
    if (establishment_id != null) {
      const deleted = await EstablishmentService.destroy({
        where: {
          service_id: id,
          establishment_id: Number(establishment_id),
        },
      });
      return deleted > 0;
    }

    await EstablishmentService.destroy({
      where: { service_id: id },
    });

    const deleted = await Service.destroy({
      where: { id },
    });
    return deleted > 0;
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
      attributes: RETURN_ATTRS_WITH_ESTABLISHMENT,
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

  async unlinkFromEstablishment(serviceId, establishmentId) {
    const deleted = await EstablishmentService.destroy({
      where: {
        service_id: serviceId,
        establishment_id: establishmentId,
      },
    });
    return deleted > 0;
  },

  async updateEstablishmentPrice(serviceId, establishmentId, price) {
    const [updated] = await EstablishmentService.update(
      { price },
      {
        where: {
          service_id: serviceId,
          establishment_id: establishmentId,
        },
      },
    );
    return updated > 0;
  },
};
