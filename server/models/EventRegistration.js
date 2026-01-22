import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventRegistration = sequelize.define('EventRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled', 'attended'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  },
  attendedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

export default EventRegistration;
