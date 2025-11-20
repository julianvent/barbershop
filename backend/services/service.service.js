import { ServiceValidator } from "../validators/service.validator.js";
import { ServiceRepository } from "../repositories/service.repository.js";

export const ServiceService = {
  list(params) {
    return ServiceRepository.list(params);
  },

  async get(serviceName) {
    const service = await ServiceRepository.getByName(serviceName);
    if (!service) {
      throw new Error("Service not found");
    }
    return service;
  },

  async create(body) {
    ServiceValidator.validateCreate(body);
    const name = String(body.name).trim();
    body.name = name;

    const existing = await ServiceRepository.getByName(name);
    if (existing && existing.name.toLowerCase() === name.toLowerCase()) {
      throw new Error("A service with that name already exists");
    }

    try {
      return await ServiceRepository.create(body);
    } catch (error) {
      throw new Error("A service with that name already exists");
    }
  },

  async update(serviceName, body) {
    ServiceValidator.validateUpdate(body);
    const current = await ServiceRepository.getByName(serviceName);
    if (!current) {
      throw new Error("Service not found");
    }
    if (body.name && body.name !== serviceName) {
      const existingByName = await ServiceRepository.getByName(body.name);
      if (existingByName) {
        throw new Error("A service with that name already exists");
      }
    }
    return ServiceRepository.update(serviceName, body);
  },

  async remove(serviceName) {
    const deleted = await ServiceRepository.deactivate(serviceName);
    if (!deleted) {
      throw new Error("Service not found or could not be deactivated");
    }
  },
};
