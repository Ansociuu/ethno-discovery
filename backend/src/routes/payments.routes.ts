import { Router } from 'express';
import { createPayment, sePayWebhook, getPaymentStatus } from '../controllers/payments.controller';
import { authenticate } from '../middlewares/auth.middleware';
import express from 'express';

const router = Router();

router.post('/create', authenticate, createPayment);
// Webhook không cần auth (SePay gọi trực tiếp)
router.post('/sepay/webhook', express.raw({ type: 'application/json' }), sePayWebhook);
router.get('/status/:orderCode', authenticate, getPaymentStatus);

export default router;
