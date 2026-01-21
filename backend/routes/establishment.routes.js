import {Router} from "express";
import {EstablishmentController} from "../controllers/establishment.controller.js";

const router = Router();

router.get("/", EstablishmentController.getAllEstablishments);
router.get("/:id", EstablishmentController.getEstablishmentById);
router.post("/", EstablishmentController.createEstablishment);
router.put("/:id", EstablishmentController.updateEstablishment);
router.delete("/:id", EstablishmentController.deleteEstablishment);

export default router;