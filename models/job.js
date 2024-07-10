// models/job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  banner_image: {
    type: String
  },
  content: {
    type: String,
    required: true
  },

  acceptance_status: {
    type: Boolean,
    default: true
  },
  added_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
