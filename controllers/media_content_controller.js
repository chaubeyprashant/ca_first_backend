import fs from 'fs';
import path from 'path';
import MediaContent from '../models/media_content_model.js';
import Media from '../models/media_model.js';
import multer from 'multer';

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

const upload = multer({ storage: storage }).array('content');

// Create media content
export const createMediaContent = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error' });
    }
    
    const { media_id, admin_id, navigation, position } = req.body;
    const content = req.files.map(file => ({ filename: file.filename, filetype: file.mimetype }));
    
    try {
      let mediaContent = new MediaContent({
        media_id,
        admin_id,
        content,
        navigation,
        position
      });

      await mediaContent.save();
      
      const media = await Media.findById(media_id);

      // Check if the media object exists
      if (!media) {
        return res.status(404).json({ message: 'Media not found' });
      }

      // Initialize media_content if it does not exist
      if (!media.media_content) {
        media.media_content = [];
      }

      media.media_content.push(mediaContent._id);
      await media.save();
      
      res.status(201).json(mediaContent);
    } catch (error) {
      res.status(500).json({ message: 'Server error: ' + error });
    }
  });
};

// Get media content by media ID
export const getMediaContentByMediaId = async (req, res) => {
  try {
    const mediaContent = await MediaContent.find({ media_id: req.params.media_id });
    if (!mediaContent) {
      return res.status(404).json({ message: 'Media content not found' });
    }
    res.status(200).json(mediaContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update media content by ID
export const updateMediaContent = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error' });
    }

    try {
      const mediaContent = await MediaContent.findById(req.params.id);
      if (!mediaContent) {
        return res.status(404).json({ message: 'Media content not found' });
      }

      mediaContent.content.forEach(file => {
        fs.unlinkSync(`uploads/${file.filename}`);
      });

      mediaContent.content = req.files.map(file => ({ filename: file.filename, filetype: file.mimetype }));
      await mediaContent.save();

      res.status(200).json(mediaContent);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// Delete media content by ID
export const deleteMediaContent = async (req, res) => {
  try {
    const mediaContent = await MediaContent.findByIdAndDelete(req.params.id);
    if (!mediaContent) {
      return res.status(404).json({ message: 'Media content not found' });
    }

    mediaContent.content.forEach(file => {
      fs.unlinkSync(`uploads/${file.filename}`);
    });

    const media = await Media.findById(mediaContent.media_id);
    media.media_content.pull(mediaContent._id);
    await media.save();

    res.status(200).json({ message: 'Media content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' + error});
  }
};
