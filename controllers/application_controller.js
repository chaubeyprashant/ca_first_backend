// controllers/application_controller.js
import Application from '../models/application.js';

// Create a new application
export const createApplication = async (req, res) => {
  const { job_id, application_status } = req.body;

  try {
    if (!job_id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const newApplication = new Application({
      user_id: req.user.id,
      job_id,
      application_status
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all applications for a specific user
export const getUserApplications = async (req, res) => {
    try {
      const applications = await Application.find({ user_id: req.user.id }).populate('job_id');
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

// Get all applications for a specific job
export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job_id: req.params.job_id }).populate('user_id', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit an application status
export const editApplication = async (req, res) => {
  const { application_status } = req.body;

  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is the owner of the application
    if (application.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.application_status = application_status || application.application_status;

    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is the owner of the application
    if (application.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Application.deleteOne({ _id: req.params.id });
    res.json({ message: 'Application removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
