import { Barber } from "../models/barber.model.js";


const monkeyBarber = "assets/images/monkeyBarber.png";
const RETURN_ATTRS = ["id", "barber_name", "is_active", "image_path"];

export const BarberRepository = {
    async list(offset, limit, sort){
        const options = {
            attributes: RETURN_ATTRS,
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
                image_path: barberData.image_path ?? monkeyBarber
            });
            return Barber.findByPk(newBarber.id,{
                attributes: RETURN_ATTRS
            })
        }catch(error){
            throw new Error("Error creating barber: " + error.message);
        }

    },
    async getById(id){
        const existing_barber = await Barber.findByPk(id, {
            attributes: RETURN_ATTRS,
        });
        if(!existing_barber)
            throw new Error("Barber not found");
        return existing_barber;
    },
    async update(id, barberData){
        try {
            const existing_barber = await this.getById(id);

            await existing_barber.update(barberData);

            return Barber.findByPk(existing_barber.id, {
                    attributes: RETURN_ATTRS,
            });
        }
        catch(error){
            throw new Error("Error creating barber: " + error.message);
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
    }
}