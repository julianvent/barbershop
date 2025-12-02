import { BarberService } from "../services/barber.service.js";
import { generateImageUrl } from "../utils/barber.utils.js";

export const BarberController = {
    async getAll(req, res){
        try{
            const filters = {
                page: req.query.page,
                limit: req.query.limit,
            }
            const result = await BarberService.list(filters)
            const data = result.data.map(barber => ({
                ...barber.get?.() ?? barber,
                image_path: generateImageUrl(barber.image_path)
            }));
            res.json({
                data,
                meta: result.meta
            })
        }catch (e) {
            res.status(500).json({ error: e.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const barber = await BarberService.find(id);
            barber.image_path = generateImageUrl(barber.image_path)
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
            const newBarber = await BarberService.create(barberData);
            newBarber.image_path = generateImageUrl(newBarber.image_path)
            res.status(201).json(newBarber)
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
            updateBarber.image_path = generateImageUrl(newBarber.image_path);
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