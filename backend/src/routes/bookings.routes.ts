import { Router } from 'express';
import {
  createBooking, getMyBookings, getBookingById,
  cancelBooking, getAllBookings,
} from '../controllers/bookings.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/admin', authenticate, requireAdmin, getAllBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/cancel', authenticate, cancelBooking);

export default router;
