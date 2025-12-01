import { Router } from "express";
import { BarberController } from "../controllers/barber.controller.js";
import { upload } from "../config/upload.images.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property }  from "../middlewares/require.property.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";
import { barberOutput } from "../middlewares/barber.output.middleware.js";
import requireOptionalAuth from "../middlewares/require.optional.auth.middleware.js";
const router = Router()

router.get('/', requireOptionalAuth, barberOutput(), BarberController.getAll);
router.get('/:id', requireOptionalAuth, barberOutput(), BarberController.getById);
router.post('/', requireAuth, requireRole("receptionist"), upload.any(), BarberController.create);
router.put('/:id', requireAuth, property("receptionist"), upload.any(), BarberController.update);
router.delete('/:id', requireAuth, requireRole("receptionist"), BarberController.delete);
export default router;