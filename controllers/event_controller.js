import Event from '../models/event.js';
import fs from 'fs'
import path from 'path'

// Create a new event
export const createEvent = async (req, res) => {
  const { title, detail } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newEvent = new Event({
      admin_id: req.user.id,
      title,
      detail,
      media: req.file ? req.file.path : null
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('admin_id', 'name email');
    const baseUrl = 'http://127.0.0.1:5001/';

    const updatedEvents = events.map(event => ({
      ...event._doc,
      media: `${baseUrl}${event.media.replace(/\\/g, '/')}`
    }));

    res.json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('admin_id', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const baseUrl = 'http://127.0.0.1:5001/';
    const updatedEvent = {
      ...event._doc,
      media: `${baseUrl}${event.media.replace(/\\/g, '/')}`
    };

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit an event
export const editEvent = async (req, res) => {
  const { title, detail } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // if (event.admin_id.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    event.title = title || event.title;
    event.detail = detail || event.detail;
    if (req.file) {
      event.media = req.file.path;
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // if (event.admin_id.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    // Delete the media file if it exists
    if (event.media) {
      const mediaPath = path.join('uploads/', '..', event.media);
      fs.unlink(mediaPath, (err) => {
        if (err) {
          console.error(`Failed to delete media file: ${err.message}`);
        }
      });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
