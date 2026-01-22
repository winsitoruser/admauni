import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { alumniAPI, forumAPI, eventAPI, jobAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: stats } = useQuery('alumni-stats', alumniAPI.getStats);
  const { data: recentForums } = useQuery('recent-forums', () => 
    forumAPI.getForums({ limit: 5 })
  );
  const { data: upcomingEvents } = useQuery('upcoming-events', () =>
    eventAPI.getEvents({ upcoming: true, limit: 5 })
  );
  const { data: recentJobs } = useQuery('recent-jobs', () =>
    jobAPI.getJobs({ limit: 5 })
  );

  const statCards = [
    {
      title: 'Total Alumni',
      value: stats?.data?.totalAlumni || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/alumni'
    },
    {
      title: 'Forum Aktif',
      value: recentForums?.data?.length || 0,
      icon: MessageSquare,
      color: 'bg-green-500',
      link: '/forum'
    },
    {
      title: 'Event Mendatang',
      value: upcomingEvents?.data?.length || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/events'
    },
    {
      title: 'Lowongan Kerja',
      value: recentJobs?.data?.length || 0,
      icon: Briefcase,
      color: 'bg-orange-500',
      link: '/jobs'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang, {user?.fullName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Dashboard Alumni ADMA University
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Forum Terbaru</h2>
            <Link to="/forum" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {recentForums?.data?.map((forum) => (
              <Link
                key={forum.id}
                to={`/forum/${forum.id}`}
                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">{forum.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  oleh {forum.author?.fullName} • {forum.category}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Event Mendatang</h2>
            <Link to="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents?.data?.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.startDate).toLocaleDateString('id-ID')} • {event.eventType}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Lowongan Kerja Terbaru</h2>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentJobs?.data?.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.company}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {job.jobType}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {job.location}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
