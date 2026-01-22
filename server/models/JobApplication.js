import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    }
  },
  applicantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  coverLetter: {
    type: DataTypes.TEXT
  },
  resumeFile: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

export default JobApplication;
