import { EstablishmentService } from "../services/establishment.service.js";
import { generateImageUrl } from "../utils/establishment.utils.js";

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
      };
      const establishments = await EstablishmentService.list(filters);
      const data = establishments.map((establishment) => ({
        ...(establishment.get?.() ?? establishment),
        image_path: generateImageUrl(establishment.image_path),
      }));
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const establishment = await EstablishmentService.find(id);
      establishment.image_path = generateImageUrl(establishment.image_path);
      res.status(200).json(establishment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async create(req, res) {
    try {
      if (!req.is('multipart/form-data'))
        return res.status(400).json({
            error: "Content-Type must be multipart/form-data"
      });
      const establishmentData = req.body;

      delete establishmentData.image_path;
      delete establishmentData.id;
      const file = req.files?.[0];
      if (file) establishmentData.image_path = file.filename;
      const newEstablishment =
        await EstablishmentService.create(establishmentData);
      newEstablishment.image_path = generateImageUrl(
        newEstablishment.image_path,
      );
      res.status(201).json(newEstablishment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const establishmentData = req.body;
      const file = req.files?.[0];
      delete establishmentData.id;
      delete establishmentData.image;
      if(!establishmentData.account_id) delete establishmentData.account_id;
      if (file) establishmentData.image_path = file.filename;
      const updatedEstablishment = await EstablishmentService.update(
        id,
        establishmentData,
      );
      updatedEstablishment.image_path = generateImageUrl(
        updatedEstablishment.image_path,
      );
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
