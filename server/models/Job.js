import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyLogo: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  responsibilities: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance'),
    allowNull: false
  },
  workMode: {
    type: DataTypes.ENUM('onsite', 'remote', 'hybrid'),
    allowNull: false
  },
  salaryMin: {
    type: DataTypes.INTEGER
  },
  salaryMax: {
    type: DataTypes.INTEGER
  },
  salaryCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'IDR'
  },
  experienceLevel: {
    type: DataTypes.ENUM('entry', 'mid', 'senior', 'lead'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  postedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  applicationDeadline: {
    type: DataTypes.DATE
  },
  applicationEmail: {
    type: DataTypes.STRING
  },
  applicationUrl: {
    type: DataTypes.STRING
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'closed', 'filled'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true
});

export default Job;
