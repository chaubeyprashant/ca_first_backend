import Job from '../models/job.js';
import Application from '../models/application.js';

// Create a new job
export const createJob = async (req, res) => {
  const { content } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ message: 'Job content is required' });
    }

    const newJob = new Job({
      banner_image: req.file ? req.file.path : null,
      content
    });

    const savedJob = await newJob.save();

    // Base URL for the banner images
    const baseUrl = 'http://127.0.0.1:5001/';

    // Update the banner_image URL
    const updatedJob = {
      ...savedJob.toObject(),
      banner_image: savedJob.banner_image ? `${baseUrl}${savedJob.banner_image}` : null
    };

    res.status(201).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all jobs
// Get all jobs with attached applications
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    // Base URL for the banner images
    const baseUrl = 'http://127.0.0.1:5001/';

    // Create an array to hold jobs with their applications and full banner_image URL
    const jobsWithApplications = await Promise.all(jobs.map(async (job) => {
      const applications = await Application.find({ job_id: job._id }).populate('user_id', 'name email');
      const jobObject = job.toObject();
      
      // Prepend base URL to banner_image
      if (jobObject.banner_image) {
        jobObject.banner_image = `${baseUrl}${jobObject.banner_image}`;
      }

      return { ...jobObject, applications };
    }));

    res.json(jobsWithApplications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single job with attached applications and users who applied for the job
export const getOneJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applications = await Application.find({ job_id: req.params.id }).populate('user_id', 'name email');

    res.json({ job, applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a job
export const editJob = async (req, res) => {
  const { content } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.content = content || job.content;

    if (req.file) {
      job.banner_image = req.file.path;
    }

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}