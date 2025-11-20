import { ScheduleController } from "../controllers/schedule.controller.js";
import express from "express";

const router = express.Router();

router.get("/", ScheduleController.getAll);
router.get("/:day_of_week", ScheduleController.getByDay);
router.post("/", ScheduleController.create);
router.put("/:day_of_week", ScheduleController.update);
router.post("/bulk", ScheduleController.createMultiple);
router.put("/bulk", ScheduleController.updateMultiple);

export default router;
