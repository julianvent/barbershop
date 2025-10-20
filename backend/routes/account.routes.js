import { AccountController } from "../controllers/account.controller.js";
import { Router } from 'express';

const router = Router();

router.post('/login', AccountController.login);
router.get('/', AccountController.getAll);
router.get('/:id', AccountController.getById);
router.post('/', AccountController.create);
router.put('/:id', AccountController.update);
router.delete('/:id', AccountController.delete);


export default router;