import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadCV,
  addWorkHistory,
  updateWorkHistory,
  deleteWorkHistory,
  getUserProfile
} from '../controllers/profileController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, verifiedOnly, updateProfile);
router.post('/photo', protect, verifiedOnly, uploadProfilePhoto);
router.post('/cv', protect, verifiedOnly, uploadCV);
router.post('/work-history', protect, verifiedOnly, addWorkHistory);
router.put('/work-history/:id', protect, verifiedOnly, updateWorkHistory);
router.delete('/work-history/:id', protect, verifiedOnly, deleteWorkHistory);
router.get('/:userId', protect, getUserProfile);

export default router;
