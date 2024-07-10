import Media from '../models/media_model.js';
import MediaContent from '../models/media_content_model.js';

// Create new media
export const createMedia = async (req, res) => {
  const { admin_id, title, subtitle, detail,component_type, navigation, position, uploaded_at } = req.body;

  try {
    let media = new Media({
      admin_id,
      title,
      subtitle,
      detail,
      component_type,
      navigation,
      position,
      uploaded_at
    });

    await media.save();

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error :- ' + error });
  }
};

// Get all media
export const getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.find().populate('media_content');
    res.status(200).json(mediaList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get media by ID
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate('media_content');
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    res.status(200).json(media);
  } catch (error) {
    res.status500.json({ message: 'Server error' });
  }
};

// Update media by ID
export const updateMedia = async (req, res) => {
  const { title, subtitle, detail, uploaded_at } = req.body;

  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    media.title = title || media.title;
    media.subtitle = subtitle || media.subtitle;
    media.detail = detail || media.detail;
    media.uploaded_at = uploaded_at || media.uploaded_at;
    media.navigation = navigation || media.navigation;
    media.position = position || media.position;


    await media.save();

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete media by ID
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    await MediaContent.deleteMany({ media_id: media._id });

    media.media_content.forEach(contentId => {
      const mediaContent = MediaContent.findById(contentId);
      mediaContent.content.forEach(file => {
        fs.unlinkSync(`uploads/${file.filename}`);
      });
    });

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
