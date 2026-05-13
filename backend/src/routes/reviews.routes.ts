import { Router } from 'express';
import { getReviews, createReview, getWishlist, addToWishlist, removeFromWishlist } from '../controllers/reviews.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Reviews
router.get('/:type/:id', getReviews);
router.post('/', authenticate, createReview);

export default router;
