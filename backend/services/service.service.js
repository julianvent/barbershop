import { ServiceValidator } from "../validators/service.validator.js";
import { ServiceRepository } from "../repositories/service.repository.js";

export const ServiceService = {
  list(params) {
    return ServiceRepository.list(params);
  },

  async get(serviceId, establishmentId = null) {
    const service = await ServiceRepository.getById(
      serviceId,
      establishmentId ? Number(establishmentId) : null,
    );
    if (!service) {
      throw new Error("Service not found");
    }
    return service;
  },

  async create(body, user = {}, establishment_id = null) {
    ServiceValidator.validateCreate(body);
    const name = String(body.name).trim();
    body.name = name;

    try {
      // Create service and link in a transaction for safety
      const service = await ServiceRepository.createWithLinks(
        body,
        establishment_id,
        user.role === "admin"
      );

      return service;
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("A service with that name already exists");
      }
      throw error;
    }
  },

  async update(serviceId, body, establishmentId = null, isAdmin = false) {
    ServiceValidator.validateUpdate(body);
    const current = await ServiceRepository.getById(serviceId, establishmentId);
    if (!current) {
      throw new Error("Service not found");
    }
    return ServiceRepository.update(serviceId, body, establishmentId, isAdmin);
  },

  async remove(serviceId, establishmentId = null) {
    const deleted = await ServiceRepository.deactivate(serviceId, establishmentId);
    if (!deleted) {
      const action = establishmentId ? "unlinked from establishment" : "unlinked from all establishments";
      throw new Error(`Service not found or could not be ${action}`);
    }
  },

  async getByEstablishment(establishmentId, params = {}) {
    if (!establishmentId || isNaN(Number(establishmentId))) {
      throw new Error("Valid establishment ID is required");
    }
    return ServiceRepository.getByEstablishment(
      Number(establishmentId),
      params,
    );
  },
};
