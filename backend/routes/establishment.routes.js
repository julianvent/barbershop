import { Router } from "express";
import { EstablishmentController } from "../controllers/establishment.controller.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { isEstablishmentOwner } from "../middlewares/require.property.establishment.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";
import { uploadAppointmentImage } from "../config/upload.images.js";


const router = Router();

router.use(requireAuth);

router.get("/",requireRole(), EstablishmentController.getAll);
router.get("/:id",requireRole(), EstablishmentController.getById);
router.post("/", requireRole(), uploadAppointmentImage.any(), EstablishmentController.create);
router.put("/:id", requireRole(), EstablishmentController.update);
router.delete("/:id", isEstablishmentOwner(), EstablishmentController.delete);
export default router;
