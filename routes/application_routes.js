// routes/application_routes.js
import express from 'express';
const router = express.Router();
import { createApplication, getUserApplications, getJobApplications, editApplication, deleteApplication } from '../controllers/application_controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth_middleware.js';

// Create application
router.post('/application', authMiddleware, createApplication);

// Get all applications for a specific user
router.get('/applications/user', authMiddleware, getUserApplications);

// Get all applications for a specific job
router.get('/applications/job/:job_id', authMiddleware, roleMiddleware('admin'), getJobApplications);

// Edit application status
router.put('/application/:id', authMiddleware, editApplication);

// Delete application
router.delete('/application/:id', authMiddleware, deleteApplication);

export default router;
