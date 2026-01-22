import {
  User,
  AlumniProfile,
  Forum,
  News,
  Event,
  Job,
  Donation,
  EventRegistration,
  JobApplication
} from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalAlumni = await User.count({ where: { role: 'alumni' } });
    const verifiedAlumni = await User.count({
      where: { role: 'alumni', isVerified: true }
    });
    const totalForums = await Forum.count();
    const totalNews = await News.count();
    const totalEvents = await Event.count();
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: 'active' } });
    const totalDonations = await Donation.sum('amount', {
      where: { paymentStatus: 'completed' }
    });

    const recentUsers = await User.findAll({
      where: { role: 'alumni' },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'fullName', 'email', 'isVerified', 'createdAt']
    });

    const alumniGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        role: 'alumni',
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        totalAlumni,
        verifiedAlumni,
        totalForums,
        totalNews,
        totalEvents,
        totalJobs,
        activeJobs,
        totalDonations: totalDonations || 0,
        recentUsers,
        alumniGrowth
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, isVerified, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (role) where.role = role;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { nim: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: AlumniProfile, as: 'profile' }],
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

export const verifyUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated'
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingContent = async (req, res, next) => {
  try {
    const pendingForums = await Forum.findAll({
      where: { status: 'pending' },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const pendingEvents = await Event.findAll({
      where: { status: 'draft' },
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'fullName']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        forums: pendingForums,
        events: pendingEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

export const approveContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    let content;
    if (type === 'forum') {
      content = await Forum.findByPk(id);
      if (content) {
        content.status = 'approved';
        await content.save();
      }
    } else if (type === 'event') {
      content = await Event.findByPk(id);
      if (content) {
        content.status = 'published';
        await content.save();
      }
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Content approved'
    });
  } catch (error) {
    next(error);
  }
};

export const rejectContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    let content;
    if (type === 'forum') {
      content = await Forum.findByPk(id);
      if (content) {
        content.status = 'rejected';
        await content.save();
      }
    } else if (type === 'event') {
      content = await Event.findByPk(id);
      if (content) {
        content.status = 'cancelled';
        await content.save();
      }
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Content rejected'
    });
  } catch (error) {
    next(error);
  }
};

export const exportData = async (req, res, next) => {
  try {
    const { type } = req.params;

    let data;
    switch (type) {
      case 'alumni':
        data = await User.findAll({
          where: { role: 'alumni' },
          include: [{ model: AlumniProfile, as: 'profile' }],
          attributes: { exclude: ['password'] }
        });
        break;
      case 'events':
        data = await Event.findAll({
          include: [{ model: User, as: 'organizer', attributes: ['fullName'] }]
        });
        break;
      case 'jobs':
        data = await Job.findAll({
          include: [{ model: User, as: 'poster', attributes: ['fullName'] }]
        });
        break;
      case 'donations':
        data = await Donation.findAll({
          where: { paymentStatus: 'completed' },
          include: [{ model: User, as: 'donor', attributes: ['fullName'] }]
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityLog = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const recentLogins = await User.findAll({
      where: {
        lastLogin: { [Op.ne]: null }
      },
      attributes: ['id', 'fullName', 'email', 'lastLogin'],
      order: [['lastLogin', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: recentLogins
    });
  } catch (error) {
    next(error);
  }
};
