import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Building2, Calendar, TrendingUp } from 'lucide-react';
import { fetchCandidates } from '../../store/slices/candidateSlice.js';
import { fetchCompanies } from '../../store/slices/companySlice.js';
import { fetchInterviews } from '../../store/slices/interviewSlice.js';
import Card from '../../components/UI/Card.jsx';
import Badge from '../../components/UI/Badge.jsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: candidates } = useSelector(state => state.candidates);
  const { list: companies } = useSelector(state => state.companies);
  const { list: interviews } = useSelector(state => state.interviews);

  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchCompanies());
    dispatch(fetchInterviews());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Candidates',
      value: candidates.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Companies',
      value: companies.length,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Scheduled Interviews',
      value: interviews.filter(i => i.status === 'scheduled').length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Placement Rate',
      value: '78%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your recruitment activities today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Activities */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {interviews.slice(0, 5).map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{interview.candidateName}</p>
                    <p className="text-sm text-gray-600">{interview.companyName} - {interview.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={interview.status === 'scheduled' ? 'warning' : 'success'}>
                    {interview.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{interview.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => navigate('/addcandidateform')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Add New Candidate</span>
            </button>
            <button onClick={() => navigate('/interviewform')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Schedule Interview</span>
            </button>
            <button onClick={() => navigate('/addcompanyform')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Building2 className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Add Company</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;