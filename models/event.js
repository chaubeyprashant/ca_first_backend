import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  media: {
    type: String
  },
  added_date: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
},{
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
