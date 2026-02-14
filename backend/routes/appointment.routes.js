import { AppointmentController } from "../controllers/appointment.controller.js";
import { Router } from 'express';
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property } from "../middlewares/require.property.middleware.js";
import { propertyAppointment } from "../middlewares/require.property.appointment.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";
import requireOptionalAuth from "../middlewares/require.optional.auth.middleware.js"
import { uploadAppointmentImage } from "../config/upload.images.js";

const router = Router();

router.get('/availability', AppointmentController.getAvailability);
router.get('/', requireAuth, property("receptionist"), AppointmentController.getAll);
router.get('/:id', requireOptionalAuth, propertyAppointment, AppointmentController.getById);
router.post('/', requireOptionalAuth, AppointmentController.create);
router.put('/:id', requireAuth, requireRole("receptionist"), AppointmentController.update);
router.delete('/:id', requireAuth, requireRole("receptionist"), AppointmentController.delete);
router.post('/:id/complete', requireAuth, requireRole("receptionist"), uploadAppointmentImage.any(), AppointmentController.complete);
router.post('/:id/cancel', requireOptionalAuth, propertyAppointment, AppointmentController.cancel);
export default router;