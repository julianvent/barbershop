import { Router } from "express";
import { ServiceController } from "../controllers/service.controller.js";

const router = Router();

router.get("/", ServiceController.getAll);
router.get("/:name", ServiceController.getByName);
router.post("/", ServiceController.create);
router.put("/:name", ServiceController.update);
router.delete("/:name", ServiceController.delete);

export default router;
