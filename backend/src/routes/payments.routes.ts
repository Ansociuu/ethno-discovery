import { Router } from 'express';
import { createPayment, sePayWebhook, getPaymentStatus } from '../controllers/payments.controller';
import { authenticate } from '../middlewares/auth.middleware';
import express from 'express';

const router = Router();

router.post('/create', express.json(), authenticate, createPayment);
// Webhook cần raw body để kiểm tra chữ ký (signature)
router.post('/sepay/webhook', express.raw({ type: 'application/json' }), sePayWebhook);
router.get('/status/:orderCode', authenticate, getPaymentStatus);

export default router;
