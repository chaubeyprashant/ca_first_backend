import express from 'express';
import {
  createMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia
} from '../controllers/media_controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

// Media routes
router.post('/media', authMiddleware, roleMiddleware('admin'), createMedia);
router.get('/media', authMiddleware, getAllMedia);
router.get('/media/:id', authMiddleware, getMediaById);
router.put('/media/:id', authMiddleware, roleMiddleware('admin'), updateMedia);
router.delete('/media/:id', authMiddleware, roleMiddleware('admin'), deleteMedia);

export default router;
