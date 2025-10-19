import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { applyVolunteer, listApplications, getUserApplications } from '../controllers/volunteerController.js';

const router = express.Router();

router.post('/apply', authenticate, applyVolunteer);
router.get('/applications', authenticate, requireRole('admin'), listApplications);
router.get('/my-applications', authenticate, getUserApplications);

export default router;
