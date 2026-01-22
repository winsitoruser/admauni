import { Job, JobApplication, User, AlumniProfile } from '../models/index.js';
import { Op } from 'sequelize';

export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      category,
      jobType,
      workMode,
      experienceLevel,
      location,
      page = 1,
      limit = 20
    } = req.query;

    const where = { isPublished: true, status: 'active' };
    if (category) where.category = category;
    if (jobType) where.jobType = jobType;
    if (workMode) where.workMode = workMode;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Job.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'poster',
        attributes: ['id', 'fullName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'fullName']
        },
        {
          model: JobApplication,
          as: 'applications',
          include: [{
            model: User,
            as: 'applicant',
            attributes: ['id', 'fullName']
          }]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.viewCount += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.update(req.body);

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.destroy();

    res.status(200).json({
      success: true,
      message: 'Job deleted'
    });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Job is not active' });
    }

    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const existingApplication = await JobApplication.findOne({
      where: { jobId, applicantId: req.user.id }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = await JobApplication.create({
      jobId,
      applicantId: req.user.id,
      coverLetter: req.body.coverLetter,
      resumeFile: req.body.resumeFile
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.findAll({
      where: { applicantId: req.user.id },
      include: [{
        model: Job,
        as: 'job',
        include: [{
          model: User,
          as: 'poster',
          attributes: ['id', 'fullName']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await JobApplication.findAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'fullName', 'email'],
          include: [{
            model: AlumniProfile,
            as: 'profile'
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const application = await JobApplication.findByPk(applicationId, {
      include: [{ model: Job, as: 'job' }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await JobApplication.findOne({
      where: { id: applicationId, applicantId: req.user.id }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn'
    });
  } catch (error) {
    next(error);
  }
};

export const getJobStats = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalApplications = await JobApplication.count({ where: { jobId } });
    const pendingApplications = await JobApplication.count({
      where: { jobId, status: 'pending' }
    });
    const reviewedApplications = await JobApplication.count({
      where: { jobId, status: 'reviewed' }
    });
    const shortlistedApplications = await JobApplication.count({
      where: { jobId, status: 'shortlisted' }
    });

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        viewCount: job.viewCount
      }
    });
  } catch (error) {
    next(error);
  }
};
