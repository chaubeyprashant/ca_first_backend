import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String},
  subtitle: { type: String },
  detail: { type: String},
  component_type: {
    type: String,
    enum: ['carousel', 'small_banner', 'video', 'image_grid', 'content_banner'],
    default: 'content_banner' // Changed default value to one of the enum values
  },
  uploaded_at: { type: Date, default: Date.now }, // Changed type to Date
  position: { type: Number, default: 0 }, // Corrected type to Number
  navigation: { type: String, default: '' },
  media_content: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MediaContent' }],
  show:{ type: Boolean, default: true }
}, {
  timestamps: true
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
