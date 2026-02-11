import { Router } from "express";
import { ServiceController } from "../controllers/service.controller.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property } from "../middlewares/require.property.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";
import requireOptionalAuth from "../middlewares/require.optional.auth.middleware.js";

const router = Router();

router.get("/", requireOptionalAuth, ServiceController.getAll);
router.get("/:id", requireOptionalAuth, ServiceController.getById);
router.post("/",requireAuth,requireRole("receptionist", "admin"),ServiceController.create);
router.put("/:id",requireAuth,requireRole("receptionist", "admin"),ServiceController.update);
router.delete("/:id",requireAuth,requireRole("receptionist", "admin"),ServiceController.delete);

export default router;
