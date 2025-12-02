import { ServiceService } from "../services/service.service.js";

export const ServiceController = {
  async getAll(req, res) {
    try {
      const { page, limit, q, sort, dir } = req.query;
      const result = await ServiceService.list({ page, limit, q, sort, dir });
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
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
      const row = await ServiceService.create(req.body);
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
