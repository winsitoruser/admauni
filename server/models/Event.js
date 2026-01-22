import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  eventType: {
    type: DataTypes.ENUM('online', 'offline', 'hybrid'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  onlineLink: {
    type: DataTypes.STRING
  },
  maxParticipants: {
    type: DataTypes.INTEGER
  },
  registrationDeadline: {
    type: DataTypes.DATE
  },
  featuredImage: {
    type: DataTypes.STRING
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requiresApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true
});

export default Event;
