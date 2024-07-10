import mongoose from 'mongoose';

const mediaContentSchema = new mongoose.Schema({
  media_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  navigation: { type: String, default: '' },
  position: { type: Number, default: 0 },
  show:{ type: Boolean, default: true },
  content: [{
    filename: { type: String, required: true },
    filetype: { type: String, required: true }
  }]
}, {
  timestamps: true
});

const MediaContent = mongoose.model("MediaContent", mediaContentSchema);

export default MediaContent;
