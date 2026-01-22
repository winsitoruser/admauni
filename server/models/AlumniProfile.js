import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AlumniProfile = sequelize.define('AlumniProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other')
  },
  address: {
    type: DataTypes.TEXT
  },
  city: {
    type: DataTypes.STRING
  },
  province: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'Indonesia'
  },
  postalCode: {
    type: DataTypes.STRING
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gpa: {
    type: DataTypes.DECIMAL(3, 2)
  },
  currentJob: {
    type: DataTypes.STRING
  },
  currentCompany: {
    type: DataTypes.STRING
  },
  currentPosition: {
    type: DataTypes.STRING
  },
  industry: {
    type: DataTypes.STRING
  },
  bio: {
    type: DataTypes.TEXT
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  linkedin: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING
  },
  profilePhoto: {
    type: DataTypes.STRING
  },
  cvFile: {
    type: DataTypes.STRING
  },
  privacySettings: {
    type: DataTypes.JSONB,
    defaultValue: {
      showEmail: false,
      showPhone: false,
      showAddress: false,
      showWorkHistory: true,
      showInDirectory: true
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  }
}, {
  timestamps: true
});

export default AlumniProfile;
