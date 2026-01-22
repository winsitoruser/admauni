import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Dashboard from './pages/Dashboard';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';

import AlumniDirectory from './pages/alumni/AlumniDirectory';
import AlumniMap from './pages/alumni/AlumniMap';

import ForumList from './pages/forum/ForumList';
import ForumDetail from './pages/forum/ForumDetail';
import CreateForum from './pages/forum/CreateForum';

import NewsList from './pages/news/NewsList';
import NewsDetail from './pages/news/NewsDetail';

import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';
import CreateEvent from './pages/events/CreateEvent';
import MyEvents from './pages/events/MyEvents';

import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import CreateJob from './pages/jobs/CreateJob';
import MyApplications from './pages/jobs/MyApplications';

import DonationList from './pages/donations/DonationList';
import CreateDonation from './pages/donations/CreateDonation';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContent from './pages/admin/AdminContent';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') 
    ? children 
    : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        
        <Route path="alumni" element={<AlumniDirectory />} />
        <Route path="alumni/map" element={<AlumniMap />} />
        
        <Route path="forum" element={<ForumList />} />
        <Route path="forum/:id" element={<ForumDetail />} />
        <Route path="forum/create" element={<CreateForum />} />
        
        <Route path="news" element={<NewsList />} />
        <Route path="news/:slug" element={<NewsDetail />} />
        
        <Route path="events" element={<EventList />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/my-events" element={<MyEvents />} />
        
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/my-applications" element={<MyApplications />} />
        
        <Route path="donations" element={<DonationList />} />
        <Route path="donations/create" element={<CreateDonation />} />
        
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
