import { Router } from 'express';
import {
  getDestinations, getFeaturedDestinations, getDestinationBySlug,
  createDestination, updateDestination, deleteDestination,
} from '../controllers/destinations.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/:slug', getDestinationBySlug);
router.post('/', authenticate, requireAdmin, createDestination);
router.put('/:id', authenticate, requireAdmin, updateDestination);
router.delete('/:id', authenticate, requireAdmin, deleteDestination);

export default router;
