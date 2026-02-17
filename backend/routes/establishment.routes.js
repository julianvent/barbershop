import { Router } from "express";
import { EstablishmentController } from "../controllers/establishment.controller.js";
import { ServiceController } from "../controllers/service.controller.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { isEstablishmentOwner } from "../middlewares/require.property.establishment.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";
import { uploadEstablishmentImage } from "../config/upload.images.js";

const router = Router();

router.get("/", EstablishmentController.getAll);
router.get("/:id", requireAuth, requireRole("receptionist"), EstablishmentController.getById);
router.post("/", requireAuth, requireRole(), uploadEstablishmentImage.any(), EstablishmentController.create);
router.put("/:id", requireAuth, requireRole(), uploadEstablishmentImage.any(), EstablishmentController.update);
router.delete("/:id", requireAuth, isEstablishmentOwner(), EstablishmentController.delete);

router.get("/:establishment_id/services",ServiceController.getByEstablishment);
router.post("/:establishment_id/services",requireAuth,requireRole("receptionist", "admin"),ServiceController.create);

export default router;
