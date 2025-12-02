import { Router } from "express";
import { ServiceController } from "../controllers/service.controller.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property }  from "../middlewares/require.property.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";

const router = Router();

router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getById);
router.post("/", requireAuth, requireRole("receptionist"), ServiceController.create);
router.put("/:id", requireAuth, requireRole("receptionist"), ServiceController.update);
router.delete("/:id", requireAuth, requireRole("receptionist"), ServiceController.delete);

export default router;
