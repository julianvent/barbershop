import { ServiceValidator } from "../validators/service.validator.js";
import { ServiceRepository } from "../repositories/service.repository.js";
import { EstablishmentRepository } from "../repositories/establishment.repository.js";

export const ServiceService = {
  list(params) {
    return ServiceRepository.list(params);
  },

  async get(serviceId) {
    const service = await ServiceRepository.getById(serviceId);
    if (!service) {
      throw new Error("Service not found");
    }
    return service;
  },

  async create(body, user = {}) {
    ServiceValidator.validateCreate(body);
    const name = String(body.name).trim();
    body.name = name;

    try {
      const service = await ServiceRepository.create(body);

      // If admin creates the service, link it to all establishments
      if (user.role === "admin") {
        const establishments = await EstablishmentRepository.list({});
        if (establishments && establishments.length > 0) {
          await ServiceRepository.linkToAllEstablishments(
            service.id,
            service.price,
            establishments,
          );
        }
      }

      return service;
    } catch (error) {
      throw new Error("A service with that name already exists");
    }
  },

  async update(serviceId, body) {
    ServiceValidator.validateUpdate(body);
    const current = await ServiceRepository.getById(serviceId);
    if (!current) {
      throw new Error("Service not found");
    }
    return ServiceRepository.update(serviceId, body);
  },

  async remove(serviceId) {
    const deleted = await ServiceRepository.deactivate(serviceId);
    if (!deleted) {
      throw new Error("Service not found or could not be deactivated");
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
