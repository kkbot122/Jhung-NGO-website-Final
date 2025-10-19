import express from 'express';
import { listCampaigns, createCampaign, getCampaign, updateCampaign, deleteCampaign } from '../controllers/campaignController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', listCampaigns);
router.get('/:id', getCampaign);
router.post('/', authenticate, requireRole('admin'), createCampaign);
router.put('/:id', authenticate, requireRole('admin'), updateCampaign);
router.delete('/:id', authenticate, requireRole('admin'), deleteCampaign); 

export default router;
