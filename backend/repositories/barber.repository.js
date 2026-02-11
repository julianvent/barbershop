import { Barber } from "../models/barber.model.js";
import { Establishment } from "../models/establishment.model.js";
import { col } from "sequelize";

const RETURN_ATTRS = ["id", "barber_name", "is_active", "image_path", "phone", "email", "establishment_id", [col("establishment.name"), "establishment_name"]];

export const BarberRepository = {
    async list(offset, limit, sort){
        const options = {
            attributes: RETURN_ATTRS,
            include: [
                {
                    model: Establishment,
                    as: "establishment",
                    attributes: [],
                    required: false,
                },
            ],
            order: [['id', sort] ]
        }

        if (offset != null) options.offset = offset;
        if (limit  != null) options.limit  = limit

        return Barber.findAndCountAll(options)
    },
    async create(barberData) {
        try{

            const newBarber = await Barber.create({
                barber_name: barberData.barber_name,
                is_active: true,
                image_path: barberData.image_path,
                phone: barberData.phone,
                email: barberData.email,
                establishment_id: barberData.establishment_id,
            });
            return Barber.findByPk(newBarber.id,{
                attributes: RETURN_ATTRS,
                include: [
                    {
                        model: Establishment,
                        as: "establishment",
                        attributes: [],
                        required: false,
                    },
                ],
            })
        }catch(error){
            throw new Error("Error creating barber: " + error.message);
        }

    },
    async getById(id){
        const existing_barber = await Barber.findByPk(id, {
            attributes: RETURN_ATTRS,
            include: [
                {
                    model: Establishment,
                    as: "establishment",
                    attributes: [],
                    required: false,
                },
            ],
        });
        return existing_barber;
    },
    async update(id, barberData){
        try {
            const existing_barber = await this.getById(id);

            await existing_barber.update(barberData);

            return Barber.findByPk(existing_barber.id, {
                    attributes: RETURN_ATTRS,
                    include: [
                        {
                            model: Establishment,
                            as: "establishment",
                            attributes: [],
                            required: false,
                        },
                    ],
            });
        }
        catch(error){
            throw new Error("Error updating barber: " + error.message);
        }
    },
    async delete(id){
        try{
            const existing_barber = await this.getById(id);

            await existing_barber.destroy()
            return { message: "Barber deleted successfully" };
        }
        catch(error){
            throw new Error("Error deleting barber: " + error.message);
        }
    },
    async getAllIds(){
        return Barber.findAll({attributes: ["id"], raw: true})
    },
    async getByEstablishmentId(establishmentId, offset, limit, sort = 'ASC'){
        const options = {
            attributes: RETURN_ATTRS,
            include: [
                {
                    model: Establishment,
                    as: "establishment",
                    attributes: [],
                    required: false,
                },
            ],
            where: { establishment_id: establishmentId },
            order: [['id', sort]]
        }

        if (offset != null) options.offset = offset;
        if (limit  != null) options.limit  = limit;

        return Barber.findAndCountAll(options);
    }
}
