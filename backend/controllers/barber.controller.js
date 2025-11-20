import { BarberService } from "../services/barber.service.js";

export const BarberController = {
    async getAll(req, res){
        try{
            const filters = {
                page: req.query.page,
                limit: req.query.limit,
            }
            const result = await BarberService.list(filters)
            res.json(result)
        }catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const barber = await BarberService.find(id);
            res.status(200).json(barber);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    async create(req, res){
        try{
            if (!req.is('multipart/form-data'))
                return res.status(400).json({
                    error: "Content-Type must be multipart/form-data"
                });
            const barberData = req.body;
            delete barberData.image_path; // Prevent clients from setting image_path manually, since we don't use a request DTO and this field must only be assigned from the uploaded file
            const file = req.files?.[0];
            if (file) barberData.image_path = file.filename;
            const new_barber = await BarberService.create(barberData);
            res.status(201).json(new_barber)
        } catch(error) {
            res.status(500).json({ error: error.message })
        }
    },
    async update(req, res){
        try{
            if (!req.is('multipart/form-data'))
                return res.status(400).json({
                    error: "Content-Type must be multipart/form-data"
                });
            const { id } = req.params ;
            const barberData = req.body ;
            const file = req.files?.[0];
            if (file) barberData.image_path = file.filename;
            const updateBarber = await BarberService.update(id, barberData);

            res.status(200).json(updateBarber)
        } catch(error) {
            res.status(500).json({ error: error.message })
        }
    },
    async delete(req, res){
        try {
              const { id } = req.params;
              await BarberService.delete(id);
              res.status(204).send();
        } catch (error) {
              res.status(404).json({ message: error.message });
        }
    }
}