import {states} from './appointment.validator.js'

const validFields = ["barber_name"];
const orderValues = ["ASC", "DESC"]
const validUpdateFields = ["barber_name", "is_active"]

export const BarberValidator = {
    validateCreate(barberData) {
        if (!barberData || typeof barberData !== "object") {
            throw new Error("Body is empty or invalid");
        }
        for (const field of validFields) {
            if (!(field in barberData)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    },
    validateUpdate(barberData) {
        if (!barberData || typeof barberData !== "object") {
            throw new Error("Body is empty or invalid");
        }
        /*
        for (const field in barberData) {
            if (!validUpdateFields.includes(field)) {
                throw new Error(`Invalid field in update: ${field}`);
            }
        }*/
    },
    validateFiltersListbarbers(filters){
        const sort = filters.sort != null? filters.sort : null ;
        const page = filters.page != null ? Number(filters.page) : null;
        const limit = filters.limit != null ? Number(filters.limit) : null;

        if(sort != null && !orderValues.includes(sort)){
            throw new Error(`Invalid status value. Must be one of: ${orderValues.join(", ")}`);
        }

        if (page != null && (!Number.isInteger(page) || page <= 0)) {
            throw new Error("page must be a positive integer");
        }

        if (limit != null && (!Number.isInteger(limit) || limit <= 0)) {
            throw new Error("limit must be a positive integer");
        }
        return {
            sort: sort ?? 'ASC',
            page: filters.page ?? 1,
            limit: limit ? Math.min(limit, 50) : 5
        };
    }
}