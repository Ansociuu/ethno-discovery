import { Router } from 'express';
import { register, login, refresh, getMe, updateMe, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);
router.post('/change-password', authenticate, changePassword);

export default router;
