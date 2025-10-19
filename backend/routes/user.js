import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getUserDonations, 
  getUserVolunteerApplications, 
  getUserProfile 
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/donations', getUserDonations);
router.get('/volunteer-applications', getUserVolunteerApplications);
router.get('/profile', getUserProfile);

export default router;