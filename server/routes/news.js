import express from 'express';
import {
  getNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);
router.get('/slug/:slug', getNewsBySlug);
router.post('/', protect, authorize('admin', 'moderator'), createNews);
router.put('/:id', protect, authorize('admin', 'moderator'), updateNews);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteNews);

export default router;
