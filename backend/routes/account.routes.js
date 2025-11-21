import { AccountController } from "../controllers/account.controller.js";
import { Router } from 'express';
import  requireAuth  from "../middlewares/require.auth.middleware.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { property }  from "../middlewares/require.property.middleware.js";

const router = Router();

router.post('/login', AccountController.login);
router.get('/', requireAuth, requireRole("receptionist"), AccountController.getAll);
router.get('/:id', requireAuth, property("receptionist"), AccountController.getById);
router.post('/', requireAuth, requireRole("receptionist"), AccountController.create);
router.put('/:id', requireAuth, property("receptionist"), AccountController.update);
router.delete('/:id', requireAuth, requireRole("receptionist"), AccountController.delete);

export default router;