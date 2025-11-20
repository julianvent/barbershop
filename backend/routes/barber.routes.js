import { Router } from "express";
import { BarberController } from "../controllers/barber.controller.js";
import { upload } from "../config/upload.images.js";

const router = Router()

router.get('/',  BarberController.getAll);
router.get('/:id',  BarberController.getById);
router.post('/', upload.any(), BarberController.create);
router.put('/:id', upload.any(), BarberController.update);
router.delete('/:id', BarberController.delete);
export default router;