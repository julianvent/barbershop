import { EstablishmentService } from "../services/establishment.service.js";

export const EstablishmentController = {
  async getAll(req, res) {
    try {
      const filters = {
        name: req.query.name,
        street: req.query.street,
        city: req.query.city,
        state: req.query.state,
        sort: req.query.sort,
        page: req.query.page,
        limit: req.query.limit,
      }
      const establishments = await EstablishmentService.list(filters);
      res.status(200).json(establishments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const establishment = await EstablishmentService.find(id);
      establishment.image_path = generateImageUrl(
        establishment.image_path
      );
      if (establishment.image_path == null) delete establishment.image_path;
      res.status(200).json(establishment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      const establishmentData = req.body;
      const newEstablishment =
        await EstablishmentService.create(establishmentData);
      res.status(201).json(newEstablishment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const establishmentData = req.body;
      const updatedEstablishment =
        await EstablishmentService.update(id, establishmentData);
      res.status(200).json(updatedEstablishment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      await EstablishmentService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
