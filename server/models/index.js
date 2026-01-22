import sequelize from '../config/database.js';
import User from './User.js';
import AlumniProfile from './AlumniProfile.js';
import WorkHistory from './WorkHistory.js';
import Forum from './Forum.js';
import ForumComment from './ForumComment.js';
import News from './News.js';
import Event from './Event.js';
import EventRegistration from './EventRegistration.js';
import Job from './Job.js';
import JobApplication from './JobApplication.js';
import Donation from './Donation.js';
import Notification from './Notification.js';
import Connection from './Connection.js';

User.hasOne(AlumniProfile, { foreignKey: 'userId', as: 'profile' });
AlumniProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

AlumniProfile.hasMany(WorkHistory, { foreignKey: 'profileId', as: 'workHistory' });
WorkHistory.belongsTo(AlumniProfile, { foreignKey: 'profileId', as: 'profile' });

User.hasMany(Forum, { foreignKey: 'authorId', as: 'forums' });
Forum.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Forum.hasMany(ForumComment, { foreignKey: 'forumId', as: 'comments' });
ForumComment.belongsTo(Forum, { foreignKey: 'forumId', as: 'forum' });

User.hasMany(ForumComment, { foreignKey: 'authorId', as: 'comments' });
ForumComment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

ForumComment.hasMany(ForumComment, { foreignKey: 'parentId', as: 'replies' });
ForumComment.belongsTo(ForumComment, { foreignKey: 'parentId', as: 'parent' });

User.hasMany(News, { foreignKey: 'authorId', as: 'news' });
News.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

Event.hasMany(EventRegistration, { foreignKey: 'eventId', as: 'registrations' });
EventRegistration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

User.hasMany(EventRegistration, { foreignKey: 'userId', as: 'eventRegistrations' });
EventRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Job, { foreignKey: 'postedBy', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'postedBy', as: 'poster' });

Job.hasMany(JobApplication, { foreignKey: 'jobId', as: 'applications' });
JobApplication.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

User.hasMany(JobApplication, { foreignKey: 'applicantId', as: 'jobApplications' });
JobApplication.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

User.hasMany(Donation, { foreignKey: 'donorId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Connection, { foreignKey: 'requesterId', as: 'sentConnections' });
User.hasMany(Connection, { foreignKey: 'receiverId', as: 'receivedConnections' });
Connection.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Connection.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export {
  sequelize,
  User,
  AlumniProfile,
  WorkHistory,
  Forum,
  ForumComment,
  News,
  Event,
  EventRegistration,
  Job,
  JobApplication,
  Donation,
  Notification,
  Connection
};
