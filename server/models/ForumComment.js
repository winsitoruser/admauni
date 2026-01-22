import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ForumComment = sequelize.define('ForumComment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  forumId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Fora',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.UUID,
    references: {
      model: 'ForumComments',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved'
  }
}, {
  timestamps: true
});

export default ForumComment;
