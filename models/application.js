import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  application_status: {
    type: String,
    enum: ['applied','viewed', 'accepted', 'rejected','revoked'],
    default: 'applied'
  },
  applied_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
