import { Forum, ForumComment, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getForums = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const where = { status: 'approved' };
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Forum.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
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

export const getForum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'fullName']
        },
        {
          model: ForumComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'fullName']
            },
            {
              model: ForumComment,
              as: 'replies',
              include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'fullName']
              }]
            }
          ],
          where: { parentId: null },
          required: false
        }
      ]
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    forum.viewCount += 1;
    await forum.save();

    res.status(200).json({
      success: true,
      data: forum
    });
  } catch (error) {
    next(error);
  }
};

export const createForum = async (req, res, next) => {
  try {
    const forum = await Forum.create({
      ...req.body,
      authorId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: forum
    });
  } catch (error) {
    next(error);
  }
};

export const updateForum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await forum.update(req.body);

    res.status(200).json({
      success: true,
      data: forum
    });
  } catch (error) {
    next(error);
  }
};

export const deleteForum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await forum.destroy();

    res.status(200).json({
      success: true,
      message: 'Forum deleted'
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { forumId } = req.params;

    const forum = await Forum.findByPk(forumId);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.isLocked) {
      return res.status(403).json({ message: 'Forum is locked' });
    }

    const comment = await ForumComment.create({
      forumId,
      authorId: req.user.id,
      content: req.body.content,
      parentId: req.body.parentId || null
    });

    const commentWithAuthor = await ForumComment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'fullName']
      }]
    });

    res.status(201).json({
      success: true,
      data: commentWithAuthor
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await ForumComment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.update({ content: req.body.content });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await ForumComment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    next(error);
  }
};

export const likeForum = async (req, res, next) => {
  try {
    const { id } = req.params;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    forum.likeCount += 1;
    await forum.save();

    res.status(200).json({
      success: true,
      data: { likeCount: forum.likeCount }
    });
  } catch (error) {
    next(error);
  }
};
