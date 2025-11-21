import { Router } from "express";
import { ServiceController } from "../controllers/service.controller.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property }  from "../middlewares/require.property.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";

const router = Router();

router.get("/", ServiceController.getAll);
router.get("/:name", ServiceController.getByName);
router.post("/", requireAuth, requireRole("receptionist"), ServiceController.create);
router.put("/:name", requireAuth, requireRole("receptionist"), ServiceController.update);
router.delete("/:name", requireAuth, requireRole("receptionist"), ServiceController.delete);

export default router;
