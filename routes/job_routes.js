import express from 'express';
import multer from 'multer';
import { createJob, getAllJobs, getOneJob, editJob, deleteJob } from '../controllers/job_controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Extract file extension
    const fileExt = file.originalname.split('.').pop();
    
    // Remove spaces and dots (except for the extension dot) from the original name
    const sanitizedOriginalName = file.originalname
      .replace(/\s+/g, '_')               // Replace spaces with underscores
      .replace(/\.[^.]+$/, '')            // Remove file extension
      .replace(/\./g, '_');               // Replace remaining dots with underscores
    
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}.${fileExt}`);
  }
});

const upload = multer({ storage: storage });

// Create job
router.post('/job', authMiddleware, roleMiddleware('admin'), upload.single('banner_image'), createJob);

// Get all jobs
router.get('/jobs', authMiddleware, getAllJobs);

// Get one job with attached applications and users
router.get('/job/:id', authMiddleware, getOneJob);

// Edit job
router.put('/job/:id', authMiddleware, roleMiddleware('admin'), upload.single('banner_image'), editJob);

// Delete job
router.delete('/job/:id', authMiddleware, roleMiddleware('admin'), deleteJob);

export default router;
