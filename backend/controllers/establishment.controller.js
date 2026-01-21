import { EstablishmentService } from "../services/establishment.service";

export const EstablishmentController = {
    async getAllEstablishments(req, res) {
        try {
            const params = {
                page: req.query.page,
                limit: req.query.limit,
                q: req.query.q,
            };
            const result = await EstablishmentService.getAllEstablishments(params);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getEstablishmentById(req, res) {
        try {
            const { id } = req.params;
            const establishment = await EstablishmentService.getEstablishmentById(id);
            res.status(200).json(establishment);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async createEstablishment(req, res) {
        try {
            const establishmentData = req.body;
            const newEstablishment = await EstablishmentService.createEstablishment(establishmentData);
            res.status(201).json(newEstablishment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateEstablishment(req, res) {
        try {
            const { id } = req.params;
            const establishmentData = req.body;
            const updatedEstablishment = await EstablishmentService.updateEstablishment(id, establishmentData);
            res.status(200).json(updatedEstablishment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async deleteEstablishment(req, res) {
        try {
            const { id } = req.params;
            await EstablishmentService.deleteEstablishment(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};