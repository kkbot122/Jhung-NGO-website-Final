import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { createDonation, listDonations, getUserDonations } from '../controllers/donationController.js'; 

const router = express.Router();

router.post('/', authenticate, createDonation);
router.get('/', authenticate, requireRole('admin'), listDonations);
router.get('/my-donations', authenticate, getUserDonations);

export default router;
