import { News, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getNews = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (featured) where.isFeatured = true;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['isFeatured', 'DESC'],
        ['publishedAt', 'DESC']
      ]
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

export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName']
      }]
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.viewCount += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

export const getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      where: { slug, isPublished: true },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName']
      }]
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.viewCount += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    const news = await News.create({
      ...req.body,
      authorId: req.user.id,
      publishedAt: req.body.isPublished ? new Date() : null
    });

    res.status(201).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (news.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.isPublished && !news.isPublished) {
      req.body.publishedAt = new Date();
    }

    await news.update(req.body);

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    if (news.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await news.destroy();

    res.status(200).json({
      success: true,
      message: 'News deleted'
    });
  } catch (error) {
    next(error);
  }
};
