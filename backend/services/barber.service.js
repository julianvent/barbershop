import { BarberRepository } from "../repositories/barber.repository.js";
import { BarberValidator } from "../validators/barber.validator.js";
import { existsImage, removeImage } from "../config/upload.images.js";

export const BarberService = {
    async list(filters){
        const { limit, page, sort } = await BarberValidator.validateFiltersListbarbers(filters)
        const offset = (page - 1) * limit;
        const {rows: barbers, count} = await BarberRepository.list(offset, limit, sort);

        return {
            data: barbers,
            meta: {
                page: page,
                limit: limit,
                total: count,
                pages: page
            }
        }
    },
    async find(id) {
        return BarberRepository.getById(id)
    },
    async create(barberData) {
        BarberValidator.validateCreate(barberData);
        return BarberRepository.create(barberData);
    },
    async update(id, barberData){
        BarberValidator.validateUpdate(barberData);
        const existing_barber = await BarberRepository.getById(id);
        if(barberData.image_path && existsImage(existing_barber.image_path) && existing_barber.image_path != 'default.png')
            removeImage(existing_barber.image_path);

        return BarberRepository.update(id, barberData)
    },
    async delete(id){
        const existing_barber = await BarberRepository.getById(id);

         if(existsImage(existing_barber.image_path) && existing_barber.image_path != 'default.png'){
                removeImage(existing_barber.image_path);
            }
        return BarberRepository.delete(id)
    }
}