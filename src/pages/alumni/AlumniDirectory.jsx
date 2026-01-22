import { useState } from 'react';
import { Search, Filter, MapPin, Briefcase, GraduationCap, Mail, Linkedin, Globe, Users, TrendingUp } from 'lucide-react';

const MOCK_ALUMNI = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    photo: null,
    major: 'Computer Science',
    graduationYear: 2018,
    currentPosition: 'Senior Software Architect',
    company: 'Google',
    location: 'San Francisco, USA',
    industry: 'Technology',
    linkedin: 'linkedin.com/in/sarahjohnson',
    email: 'sarah.j@example.com'
  },
  {
    id: 2,
    name: 'Michael Chen',
    photo: null,
    major: 'Business Administration',
    graduationYear: 2019,
    currentPosition: 'Product Manager',
    company: 'Microsoft',
    location: 'Seattle, USA',
    industry: 'Technology',
    linkedin: 'linkedin.com/in/michaelchen'
  },
  {
    id: 3,
    name: 'Dr. Aisha Rahman',
    photo: null,
    major: 'Biomedical Engineering',
    graduationYear: 2017,
    currentPosition: 'Research Scientist',
    company: 'Johns Hopkins University',
    location: 'Baltimore, USA',
    industry: 'Healthcare',
    linkedin: 'linkedin.com/in/aisharahman'
  },
  {
    id: 4,
    name: 'David Martinez',
    photo: null,
    major: 'Mechanical Engineering',
    graduationYear: 2020,
    currentPosition: 'Lead Engineer',
    company: 'Tesla',
    location: 'Austin, USA',
    industry: 'Automotive',
    linkedin: 'linkedin.com/in/davidmartinez'
  },
  {
    id: 5,
    name: 'Emily Wong',
    photo: null,
    major: 'Data Science',
    graduationYear: 2021,
    currentPosition: 'Data Scientist',
    company: 'Amazon',
    location: 'New York, USA',
    industry: 'E-commerce',
    linkedin: 'linkedin.com/in/emilywong'
  },
  {
    id: 6,
    name: 'James Anderson',
    photo: null,
    major: 'Finance',
    graduationYear: 2019,
    currentPosition: 'Investment Analyst',
    company: 'Goldman Sachs',
    location: 'London, UK',
    industry: 'Finance',
    linkedin: 'linkedin.com/in/jamesanderson'
  },
  {
    id: 7,
    name: 'Priya Patel',
    photo: null,
    major: 'Marketing',
    graduationYear: 2020,
    currentPosition: 'Marketing Director',
    company: 'Unilever',
    location: 'Singapore',
    industry: 'Consumer Goods',
    linkedin: 'linkedin.com/in/priyapatel'
  },
  {
    id: 8,
    name: 'Robert Kim',
    photo: null,
    major: 'Architecture',
    graduationYear: 2018,
    currentPosition: 'Senior Architect',
    company: 'Foster + Partners',
    location: 'Dubai, UAE',
    industry: 'Architecture',
    linkedin: 'linkedin.com/in/robertkim'
  }
];

const STATS = [
  { label: 'Total Alumni', value: '15,000+', icon: Users, color: 'bg-blue-500' },
  { label: 'Countries', value: '85+', icon: MapPin, color: 'bg-green-500' },
  { label: 'Industries', value: '120+', icon: Briefcase, color: 'bg-purple-500' },
  { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'bg-orange-500' }
];

const MAJORS = ['All Majors', 'Computer Science', 'Business Administration', 'Engineering', 'Data Science', 'Finance', 'Marketing'];
const YEARS = ['All Years', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
const INDUSTRIES = ['All Industries', 'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Automotive', 'Architecture'];

export default function AlumniDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All Majors');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAlumni = MOCK_ALUMNI.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMajor = selectedMajor === 'All Majors' || alumni.major === selectedMajor;
    const matchesYear = selectedYear === 'All Years' || alumni.graduationYear.toString() === selectedYear;
    const matchesIndustry = selectedIndustry === 'All Industries' || alumni.industry === selectedIndustry;
    
    return matchesSearch && matchesMajor && matchesYear && matchesIndustry;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Alumni Network
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Connect with over 15,000 ADMA graduates making an impact across 85 countries worldwide
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                🌍 Global Community
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                💼 Career Opportunities
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                🤝 Mentorship Programs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {MAJORS.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredAlumni.length}</span> alumni
        </p>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAlumni.map((alumni) => (
          <div
            key={alumni.id}
            className="card hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            {/* Profile Photo */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {alumni.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Name & Title */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {alumni.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{alumni.currentPosition}</p>
              <p className="text-sm font-medium text-primary-600 mt-1">{alumni.company}</p>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span>{alumni.major} • Class of {alumni.graduationYear}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{alumni.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{alumni.industry}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {alumni.email && (
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email</span>
                </button>
              )}
              {alumni.linkedin && (
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAlumni.length === 0 && (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No alumni found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200">
        <div className="text-center py-8">
          <Globe className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Join Our Global Network
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Connect with fellow alumni, explore career opportunities, and give back to the ADMA community
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary">
              Update Your Profile
            </button>
            <button className="btn btn-outline">
              Explore Mentorship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
