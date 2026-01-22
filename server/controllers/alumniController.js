import { AlumniProfile, User, Connection } from '../models/index.js';
import { Op } from 'sequelize';

export const searchAlumni = async (req, res, next) => {
  try {
    const {
      search,
      major,
      faculty,
      graduationYear,
      city,
      company,
      page = 1,
      limit = 20
    } = req.query;

    const where = {
      'privacySettings.showInDirectory': true
    };

    if (major) where.major = major;
    if (faculty) where.faculty = faculty;
    if (graduationYear) where.graduationYear = graduationYear;
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (company) where.currentCompany = { [Op.iLike]: `%${company}%` };

    const userWhere = {};
    if (search) {
      userWhere.fullName = { [Op.iLike]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await AlumniProfile.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'nim'],
        where: userWhere
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const sanitizedRows = rows.map(profile => ({
      ...profile.toJSON(),
      phone: profile.privacySettings.showPhone ? profile.phone : null,
      email: profile.privacySettings.showEmail ? profile.user.email : null,
      address: profile.privacySettings.showAddress ? profile.address : null
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

export const getAlumniMap = async (req, res, next) => {
  try {
    const alumni = await AlumniProfile.findAll({
      where: {
        latitude: { [Op.ne]: null },
        longitude: { [Op.ne]: null },
        'privacySettings.showInDirectory': true
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['fullName']
      }],
      attributes: ['id', 'userId', 'city', 'currentCompany', 'latitude', 'longitude']
    });

    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (error) {
    next(error);
  }
};

export const getAlumniStats = async (req, res, next) => {
  try {
    const totalAlumni = await AlumniProfile.count();

    const byGraduationYear = await AlumniProfile.findAll({
      attributes: [
        'graduationYear',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['graduationYear'],
      order: [['graduationYear', 'DESC']]
    });

    const byMajor = await AlumniProfile.findAll({
      attributes: [
        'major',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['major'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    const byCity = await AlumniProfile.findAll({
      attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        city: { [Op.ne]: null }
      },
      group: ['city'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        totalAlumni,
        byGraduationYear,
        byMajor,
        byCity
      }
    });
  } catch (error) {
    next(error);
  }
};

export const connectWithAlumni = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const existingConnection = await Connection.findOne({
      where: {
        [Op.or]: [
          { requesterId: req.user.id, receiverId },
          { requesterId: receiverId, receiverId: req.user.id }
        ]
      }
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    const connection = await Connection.create({
      requesterId: req.user.id,
      receiverId,
      message: req.body.message
    });

    res.status(201).json({
      success: true,
      data: connection
    });
  } catch (error) {
    next(error);
  }
};

export const respondToConnection = async (req, res, next) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;

    const connection = await Connection.findOne({
      where: {
        id: connectionId,
        receiverId: req.user.id
      }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({
      success: true,
      data: connection
    });
  } catch (error) {
    next(error);
  }
};

export const getMyConnections = async (req, res, next) => {
  try {
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [
          { requesterId: req.user.id },
          { receiverId: req.user.id }
        ],
        status: 'accepted'
      },
      include: [
        { model: User, as: 'requester', attributes: ['id', 'fullName'] },
        { model: User, as: 'receiver', attributes: ['id', 'fullName'] }
      ]
    });

    res.status(200).json({
      success: true,
      data: connections
    });
  } catch (error) {
    next(error);
  }
};
