import express from 'express';
import { createPaymentOrder, paymentWebhook, getPaymentStatus } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', authenticate, createPaymentOrder);
router.post('/webhook', paymentWebhook);
router.get('/status/:orderId', authenticate, getPaymentStatus);

export default router;