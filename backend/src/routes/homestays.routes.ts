import { Router } from 'express';
import {
  getHomestays, getFeaturedHomestays, getHomestayById,
  createHomestay, updateHomestay, deleteHomestay,
} from '../controllers/homestays.controller';
import { authenticate, requireAdmin, requireHost } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getHomestays);
router.get('/featured', getFeaturedHomestays);
router.get('/:id', getHomestayById);
router.post('/', authenticate, requireHost, createHomestay);
router.put('/:id', authenticate, requireHost, updateHomestay);
router.delete('/:id', authenticate, requireAdmin, deleteHomestay);

export default router;
