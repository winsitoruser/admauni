import { Donation, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const where = { paymentStatus: 'completed' };

    const offset = (page - 1) * limit;

    const { count, rows } = await Donation.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'donor',
        attributes: ['id', 'fullName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['paidAt', 'DESC']]
    });

    const sanitizedRows = rows.map(donation => ({
      ...donation.toJSON(),
      donor: donation.isAnonymous ? null : donation.donor
    }));

    res.status(200).json({
      success: true,
      data: sanitizedRows,
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

export const createDonation = async (req, res, next) => {
  try {
    const donation = await Donation.create({
      ...req.body,
      donorId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, receiptUrl } = req.body;

    const donation = await Donation.findByPk(id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.paymentStatus = paymentStatus;
    if (transactionId) donation.transactionId = transactionId;
    if (receiptUrl) donation.receiptUrl = receiptUrl;
    if (paymentStatus === 'completed') donation.paidAt = new Date();

    await donation.save();

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.findAll({
      where: { donorId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationStats = async (req, res, next) => {
  try {
    const totalDonations = await Donation.sum('amount', {
      where: { paymentStatus: 'completed' }
    });

    const donorCount = await Donation.count({
      where: { paymentStatus: 'completed' },
      distinct: true,
      col: 'donorId'
    });

    const byPurpose = await Donation.findAll({
      attributes: [
        'purpose',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { paymentStatus: 'completed' },
      group: ['purpose']
    });

    res.status(200).json({
      success: true,
      data: {
        totalDonations: totalDonations || 0,
        donorCount,
        byPurpose
      }
    });
  } catch (error) {
    next(error);
  }
};
