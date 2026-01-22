import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  updateRegistrationStatus,
  cancelRegistration,
  getMyEvents,
  sendEventReminders
} from '../controllers/eventController.js';
import { protect, verifiedOnly, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getEvents);
router.get('/my-events', protect, verifiedOnly, getMyEvents);
router.get('/:id', protect, getEvent);
router.post('/', protect, verifiedOnly, createEvent);
router.put('/:id', protect, verifiedOnly, updateEvent);
router.delete('/:id', protect, verifiedOnly, deleteEvent);
router.post('/:eventId/register', protect, verifiedOnly, registerForEvent);
router.put('/registration/:registrationId', protect, verifiedOnly, updateRegistrationStatus);
router.delete('/:eventId/register', protect, verifiedOnly, cancelRegistration);
router.post('/:eventId/reminders', protect, verifiedOnly, sendEventReminders);

export default router;
