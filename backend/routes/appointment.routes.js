import { AppointmentController } from "../controllers/appointment.controller.js";
import { Router } from 'express';

const router = Router();

router.get('/availability', AppointmentController.getAvailability);
router.get('/', AppointmentController.getAll);
router.get('/:id', AppointmentController.getById);
router.post('/', AppointmentController.create);
router.put('/:id', AppointmentController.update);
router.delete('/:id', AppointmentController.delete);

export default router;
