
import { ServiceService } from "../services/service.service.js";

export const ServiceController = {
  async getAll(req, res) {
    try {

      const { page, limit, q, sort, dir } = req.query;
      const establishment_id = req.query.establishment_id || req.query.establishment;
      const filters = { page, limit, q, sort, dir, establishment_id };

      // todo: check the scenario when its a client making an appoinment
      // if (req.user?.role === "receptionist" && req.user?.establishment_id) {
      //   filters.establishment_id = req.user.establishment_id;
      // }

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
      const establishment_id = req.query.establishment_id || req.query.establishment;
      const row = await ServiceService.get(
        req.params.id,
        establishment_id,
      );
      res.json(row);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      let establishment_id = 
        req.params.establishment_id || 
        req.query.establishment_id || 
        req.body.establishment_id || 
        null;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      const row = await ServiceService.create(
        req.body,
        req.user,
        establishment_id ? Number(establishment_id) : null,
      );
      res.status(201).json(row);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      let establishment_id = req.query.establishment_id || req.query.establishment || null;
      const isAdmin = req.user?.role === "admin";

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      const row = await ServiceService.update(
        req.params.id,
        req.body,
        establishment_id ? Number(establishment_id) : null,
        isAdmin,
      );
      res.json(row);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async delete(req, res) {
    try {
      let establishment_id = req.query.establishment_id || req.query.establishment || null;

      if (req.user?.role === "receptionist" && req.user?.establishment_id) {
        establishment_id = req.user.establishment_id;
      }

      await ServiceService.remove(
        req.params.id,
        establishment_id ? Number(establishment_id) : null,
      );
      res.status(204).send();
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },
};
