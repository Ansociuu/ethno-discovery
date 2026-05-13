import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/reviews.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getWishlist);
router.post('/', authenticate, addToWishlist);
router.delete('/:itemType/:itemId', authenticate, removeFromWishlist);

export default router;
