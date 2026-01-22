import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Briefcase, Edit, Calendar } from 'lucide-react';
import { profileAPI } from '../../services/api';

export default function Profile() {
  const { data: profile, isLoading } = useQuery('my-profile', profileAPI.getProfile);

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const profileData = profile?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profil Saya</h1>
        <Link to="/profile/edit" className="btn btn-primary flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit Profil
        </Link>
      </div>

      <div className="card">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            {profileData?.profilePhoto ? (
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-400">
                {profileData?.user?.fullName?.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profileData?.user?.fullName}
            </h2>
            <p className="text-gray-600 mt-1">NIM: {profileData?.user?.nim}</p>
            <p className="text-gray-600">
              {profileData?.major} • {profileData?.faculty}
            </p>
            <p className="text-gray-600">Angkatan {profileData?.graduationYear}</p>

            {profileData?.currentPosition && (
              <div className="flex items-center gap-2 mt-4 text-gray-700">
                <Briefcase className="w-5 h-5" />
                <span>
                  {profileData.currentPosition} at {profileData.currentCompany}
                </span>
              </div>
            )}
          </div>
        </div>

        {profileData?.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-700">{profileData.bio}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5" />
              <span>{profileData?.user?.email}</span>
            </div>
            {profileData?.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5" />
                <span>{profileData.phone}</span>
              </div>
            )}
            {profileData?.city && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5" />
                <span>{profileData.city}, {profileData.province}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Skills & Interests</h3>
          {profileData?.skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profileData?.interests?.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {profileData?.workHistory?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Riwayat Pekerjaan</h3>
          <div className="space-y-4">
            {profileData.workHistory.map((work) => (
              <div key={work.id} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{work.position}</h4>
                  <p className="text-gray-600">{work.company}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(work.startDate).toLocaleDateString('id-ID')} -{' '}
                      {work.isCurrent
                        ? 'Sekarang'
                        : new Date(work.endDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {work.description && (
                    <p className="text-gray-700 mt-2">{work.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
