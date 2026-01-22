import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

export const profileAPI = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
  uploadPhoto: (formData) => api.post('/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadCV: (formData) => api.post('/profile/cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addWorkHistory: (data) => api.post('/profile/work-history', data),
  updateWorkHistory: (id, data) => api.put(`/profile/work-history/${id}`, data),
  deleteWorkHistory: (id) => api.delete(`/profile/work-history/${id}`),
  getUserProfile: (userId) => api.get(`/profile/${userId}`),
};

export const alumniAPI = {
  search: (params) => api.get('/alumni/search', { params }),
  getMap: () => api.get('/alumni/map'),
  getStats: () => api.get('/alumni/stats'),
  connect: (data) => api.post('/alumni/connect', data),
  respondToConnection: (connectionId, status) => 
    api.put(`/alumni/connect/${connectionId}`, { status }),
  getConnections: () => api.get('/alumni/connections'),
};

export const forumAPI = {
  getForums: (params) => api.get('/forum', { params }),
  getForum: (id) => api.get(`/forum/${id}`),
  createForum: (data) => api.post('/forum', data),
  updateForum: (id, data) => api.put(`/forum/${id}`, data),
  deleteForum: (id) => api.delete(`/forum/${id}`),
  addComment: (forumId, data) => api.post(`/forum/${forumId}/comments`, data),
  updateComment: (commentId, data) => api.put(`/forum/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/forum/comments/${commentId}`),
  likeForum: (id) => api.post(`/forum/${id}/like`),
};

export const newsAPI = {
  getNews: (params) => api.get('/news', { params }),
  getNewsById: (id) => api.get(`/news/${id}`),
  getNewsBySlug: (slug) => api.get(`/news/slug/${slug}`),
  createNews: (data) => api.post('/news', data),
  updateNews: (id, data) => api.put(`/news/${id}`, data),
  deleteNews: (id) => api.delete(`/news/${id}`),
};

export const eventAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  register: (eventId, data) => api.post(`/events/${eventId}/register`, data),
  cancelRegistration: (eventId) => api.delete(`/events/${eventId}/register`),
  getMyEvents: () => api.get('/events/my-events'),
  updateRegistrationStatus: (registrationId, status) =>
    api.put(`/events/registration/${registrationId}`, { status }),
  sendReminders: (eventId) => api.post(`/events/${eventId}/reminders`),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  apply: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data),
  getMyApplications: () => api.get('/jobs/my-applications'),
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId, data) =>
    api.put(`/jobs/applications/${applicationId}`, data),
  withdrawApplication: (applicationId) =>
    api.delete(`/jobs/applications/${applicationId}`),
  getJobStats: (jobId) => api.get(`/jobs/${jobId}/stats`),
};

export const donationAPI = {
  getDonations: (params) => api.get('/donations', { params }),
  createDonation: (data) => api.post('/donations', data),
  updateDonationStatus: (id, data) => api.put(`/donations/${id}`, data),
  getMyDonations: () => api.get('/donations/my-donations'),
  getStats: () => api.get('/donations/stats'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  verifyUser: (userId) => api.put(`/admin/users/${userId}/verify`),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deactivateUser: (userId) => api.put(`/admin/users/${userId}/deactivate`),
  getPendingContent: () => api.get('/admin/pending-content'),
  approveContent: (type, id) => api.put(`/admin/content/${type}/${id}/approve`),
  rejectContent: (type, id) => api.put(`/admin/content/${type}/${id}/reject`),
  exportData: (type) => api.get(`/admin/export/${type}`),
  getActivityLog: (params) => api.get('/admin/activity-log', { params }),
};

export default api;
