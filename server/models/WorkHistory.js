import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WorkHistory = sequelize.define('WorkHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'AlumniProfiles',
      key: 'id'
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  industry: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default WorkHistory;
