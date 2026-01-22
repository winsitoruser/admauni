import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  verifyUser,
  updateUserRole,
  deactivateUser,
  getPendingContent,
  approveContent,
  rejectContent,
  exportData,
  getActivityLog
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'moderator'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/verify', verifyUser);
router.put('/users/:userId/role', authorize('admin'), updateUserRole);
router.put('/users/:userId/deactivate', authorize('admin'), deactivateUser);
router.get('/pending-content', getPendingContent);
router.put('/content/:type/:id/approve', approveContent);
router.put('/content/:type/:id/reject', rejectContent);
router.get('/export/:type', authorize('admin'), exportData);
router.get('/activity-log', getActivityLog);

export default router;
