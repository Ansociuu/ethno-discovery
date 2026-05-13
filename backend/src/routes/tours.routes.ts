import { Router } from 'express';
import {
  getTours, getFeaturedTours, getTourById,
  createTour, updateTour, deleteTour,
} from '../controllers/tours.controller';
import { authenticate, requireAdmin, requireHost } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getTours);
router.get('/featured', getFeaturedTours);
router.get('/:id', getTourById);
router.post('/', authenticate, requireHost, createTour);
router.put('/:id', authenticate, requireHost, updateTour);
router.delete('/:id', authenticate, requireAdmin, deleteTour);

export default router;
