import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user_routes.js'
import eventRoutes from './routes/event_routes.js';
import mediaRoutes from './routes/media_routes.js';
import mediaContentRoutes from './routes/media_content_routes.js';
import jobRoutes from './routes/job_routes.js';
import applicationRoutes from './routes/application_routes.js';
//import notificationRoutes from './routes/notification_routes.js'; // Adjust the path accordingly
import cors from 'cors';


dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Middleware to serve static files (for uploaded media)
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: 'http://localhost:3000' // Remove the trailing slash
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', mediaRoutes);
app.use('/api', mediaContentRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicationRoutes);
//app.use('/api', notificationRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
