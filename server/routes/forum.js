import express from 'express';
import {
  getForums,
  getForum,
  createForum,
  updateForum,
  deleteForum,
  addComment,
  updateComment,
  deleteComment,
  likeForum
} from '../controllers/forumController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getForums);
router.get('/:id', protect, getForum);
router.post('/', protect, verifiedOnly, createForum);
router.put('/:id', protect, verifiedOnly, updateForum);
router.delete('/:id', protect, verifiedOnly, deleteForum);
router.post('/:forumId/comments', protect, verifiedOnly, addComment);
router.put('/comments/:commentId', protect, verifiedOnly, updateComment);
router.delete('/comments/:commentId', protect, verifiedOnly, deleteComment);
router.post('/:id/like', protect, verifiedOnly, likeForum);

export default router;
