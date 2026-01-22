import express from 'express';
import {
  getDonations,
  createDonation,
  updateDonationStatus,
  getMyDonations,
  getDonationStats
} from '../controllers/donationController.js';
import { protect, verifiedOnly, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDonations);
router.get('/stats', getDonationStats);
router.get('/my-donations', protect, verifiedOnly, getMyDonations);
router.post('/', protect, verifiedOnly, createDonation);
router.put('/:id', protect, authorize('admin'), updateDonationStatus);

export default router;
