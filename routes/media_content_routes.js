import express from 'express';
import {
  createMediaContent,
  getMediaContentByMediaId,
  updateMediaContent,
  deleteMediaContent
} from '../controllers/media_content_controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

// Media content routes
router.post('/media_content', authMiddleware, roleMiddleware('admin'), createMediaContent);
router.get('/media_content/:media_id', authMiddleware, getMediaContentByMediaId);
router.put('/media_content/:id', authMiddleware, roleMiddleware('admin'), updateMediaContent);
router.delete('/media_content/:id', authMiddleware, roleMiddleware('admin'), deleteMediaContent);

export default router;
