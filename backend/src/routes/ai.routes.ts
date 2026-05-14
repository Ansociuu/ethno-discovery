import { Router } from 'express';
import { generateTrip, saveTrip, getSavedTrips, deleteTrip, chatCustomerCare } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate', authenticate, generateTrip);
router.post('/chatbot', chatCustomerCare); // Public route for customer care
router.post('/save', authenticate, saveTrip);
router.get('/trips', authenticate, getSavedTrips);
router.delete('/trips/:id', authenticate, deleteTrip);

export default router;
