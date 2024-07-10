import express from 'express'
const router = express.Router();
import multer from 'multer'
import {createEvent,deleteEvent,getAllEvents,editEvent} from '../controllers/eventController.js';
import { authMiddleware, roleMiddleware} from '../middleware/authMiddleware.js';

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

// Create event
router.post('/event', authMiddleware, roleMiddleware('admin'), upload.single('media'), createEvent);

// Get all events
router.get('/events', authMiddleware,roleMiddleware('admin'), getAllEvents);

// Edit event
router.put('/event/:id', authMiddleware,roleMiddleware('admin'), upload.single('media'), editEvent);

// Delete event
router.delete('/event/:id', authMiddleware,roleMiddleware('admin'), deleteEvent);


export default router
