import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Newspaper,
  Calendar,
  Briefcase,
  Heart,
  Settings,
  Shield,
  Map
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/alumni', icon: Users, label: 'Direktori Alumni' },
    { to: '/alumni/map', icon: Map, label: 'Peta Alumni' },
    { to: '/forum', icon: MessageSquare, label: 'Forum' },
    { to: '/news', icon: Newspaper, label: 'Berita' },
    { to: '/events', icon: Calendar, label: 'Event' },
    { to: '/jobs', icon: Briefcase, label: 'Lowongan Kerja' },
    { to: '/donations', icon: Heart, label: 'Donasi' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">
                Admin
              </p>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Dashboard Admin</span>
              </NavLink>
            </div>
          </>
        )}

        <div className="pt-4 mt-4 border-t border-gray-200">
          <NavLink
            to="/profile/edit"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Pengaturan</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
