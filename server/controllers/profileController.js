import { AlumniProfile, WorkHistory, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id },
      include: [
        { model: WorkHistory, as: 'workHistory' },
        { model: User, as: 'user', attributes: ['email', 'fullName', 'nim'] }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const allowedFields = [
      'phone', 'dateOfBirth', 'gender', 'address', 'city', 'province',
      'country', 'postalCode', 'gpa', 'currentJob', 'currentCompany',
      'currentPosition', 'industry', 'bio', 'skills', 'interests',
      'linkedin', 'website', 'privacySettings', 'latitude', 'longitude'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile.profilePhoto
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.cvFile = `/uploads/cv/${req.file.filename}`;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile.cvFile
    });
  } catch (error) {
    next(error);
  }
};

export const addWorkHistory = async (req, res, next) => {
  try {
    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const workHistory = await WorkHistory.create({
      profileId: profile.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: workHistory
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id }
    });

    const workHistory = await WorkHistory.findOne({
      where: { id, profileId: profile.id }
    });

    if (!workHistory) {
      return res.status(404).json({ message: 'Work history not found' });
    }

    await workHistory.update(req.body);

    res.status(200).json({
      success: true,
      data: workHistory
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await AlumniProfile.findOne({
      where: { userId: req.user.id }
    });

    const workHistory = await WorkHistory.findOne({
      where: { id, profileId: profile.id }
    });

    if (!workHistory) {
      return res.status(404).json({ message: 'Work history not found' });
    }

    await workHistory.destroy();

    res.status(200).json({
      success: true,
      message: 'Work history deleted'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const profile = await AlumniProfile.findOne({
      where: { userId },
      include: [
        { model: WorkHistory, as: 'workHistory' },
        { model: User, as: 'user', attributes: ['fullName', 'nim'] }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const sanitizedProfile = {
      ...profile.toJSON(),
      phone: profile.privacySettings.showPhone ? profile.phone : null,
      address: profile.privacySettings.showAddress ? profile.address : null,
      workHistory: profile.privacySettings.showWorkHistory ? profile.workHistory : []
    };

    res.status(200).json({
      success: true,
      data: sanitizedProfile
    });
  } catch (error) {
    next(error);
  }
};
