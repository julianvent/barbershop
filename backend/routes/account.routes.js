import { AccountController } from "../controllers/account.controller.js";
import { Router } from 'express';
import  requireAuth  from "../middlewares/require.auth.middleware.js";
import { requireRole } from "../middlewares/require.admin.middleware.js";
import { isAccountInEstablishment } from "../middlewares/require.property.account.middleware.js";

const router = Router();

router.post('/login', AccountController.login);
router.get('/', requireAuth, requireRole(), AccountController.getAll);
router.get('/:id', requireAuth, isAccountInEstablishment("receptionist"), AccountController.getById);
router.post('/', requireAuth, requireRole("receptionist"), AccountController.create);
router.put('/:id', requireAuth, isAccountInEstablishment("receptionist"), AccountController.update);
router.delete('/:id', requireAuth, requireRole("receptionist"), isAccountInEstablishment("receptionist"), AccountController.delete);

export default router;