import { EstablishmentRepository } from "../repositories/establishment.repository";
import { EstablishmentValidator } from "../validators/establishment.validator";


export const EstablishmentService = {
    async getAllEstablishments(params) {
        return EstablishmentRepository.getAll(params);
    },

    async getEstablishmentById(id) {
        return EstablishmentRepository.getById(id);
    },

    async createEstablishment(establishment) {
        EstablishmentValidator.validateCreate(establishment);
        return EstablishmentRepository.create(establishment);
        
    },

    async updateEstablishment(id, establishment) {
        EstablishmentValidator.validateUpdate(establishment);
        return EstablishmentRepository.update(id, establishment);
    },

    async deleteEstablishment(id) {
        return EstablishmentRepository.delete(id);
    },
};