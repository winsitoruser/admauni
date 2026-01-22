import express from 'express';
import {
  searchAlumni,
  getAlumniMap,
  getAlumniStats,
  connectWithAlumni,
  respondToConnection,
  getMyConnections
} from '../controllers/alumniController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', protect, verifiedOnly, searchAlumni);
router.get('/map', protect, verifiedOnly, getAlumniMap);
router.get('/stats', protect, getAlumniStats);
router.post('/connect', protect, verifiedOnly, connectWithAlumni);
router.put('/connect/:connectionId', protect, verifiedOnly, respondToConnection);
router.get('/connections', protect, verifiedOnly, getMyConnections);

export default router;
