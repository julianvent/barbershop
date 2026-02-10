import { ScheduleController } from "../controllers/schedule.controller.js";
import express from "express";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property }  from "../middlewares/require.property.middleware.js";
import requireAuth from "../middlewares/require.auth.middleware.js";

const router = express.Router();

router.get("/", ScheduleController.getAll);
router.get("/:day_of_week", ScheduleController.getByDay);
router.post("/", requireAuth, requireRole("receptionist"), ScheduleController.create);
router.put("/:day_of_week", requireAuth, requireRole("receptionist"), ScheduleController.update);
router.delete("/:day_of_week", requireAuth, requireRole("receptionist"), ScheduleController.delete);
router.post("/bulk", requireAuth, requireRole("receptionist"), ScheduleController.createMultiple);
router.put("/bulk", requireAuth, requireRole("receptionist"), ScheduleController.updateMultiple);

export default router;
