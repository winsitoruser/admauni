import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getJobStats
} from '../controllers/jobController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getJobs);
router.get('/my-applications', protect, verifiedOnly, getMyApplications);
router.get('/:id', protect, getJob);
router.post('/', protect, verifiedOnly, createJob);
router.put('/:id', protect, verifiedOnly, updateJob);
router.delete('/:id', protect, verifiedOnly, deleteJob);
router.post('/:jobId/apply', protect, verifiedOnly, applyForJob);
router.get('/:jobId/applications', protect, verifiedOnly, getJobApplications);
router.put('/applications/:applicationId', protect, verifiedOnly, updateApplicationStatus);
router.delete('/applications/:applicationId', protect, verifiedOnly, withdrawApplication);
router.get('/:jobId/stats', protect, verifiedOnly, getJobStats);

export default router;
