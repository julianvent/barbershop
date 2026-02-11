import { ServiceService } from "../services/service.service.js";

export const ServiceController = {
  async getAll(req, res) {
    try {
      const { page, limit, q, sort, dir, establishment_id } = req.query;
      const filters = { page, limit, q, sort, dir, establishment_id };

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        filters.establishment_id = req.user.establishment_id;
      }

      const result = await ServiceService.list(filters);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getByEstablishment(req, res) {
    try {
      const services = await ServiceService.getByEstablishment(
        req.params.establishment_id,
      );
      res.json(services);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },

  async getById(req, res) {
    try {
      const row = await ServiceService.get(req.params.id);
      res.json(row);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      // Force receptionists to link service to their establishment
      let establishment_id = null;
      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }
      
      const row = await ServiceService.create(req.body, req.user, establishment_id);
      res.status(201).json(row);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const row = await ServiceService.update(req.params.id, req.body);
      res.json(row);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      await ServiceService.remove(req.params.id);
      res.status(204).send();
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },
};
