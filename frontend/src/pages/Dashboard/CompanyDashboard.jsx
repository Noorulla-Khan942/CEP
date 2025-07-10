import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Clock, CheckCircle, Calendar } from 'lucide-react';
import { fetchInterviews } from '../../store/slices/interviewSlice.js';
import Card from '../../components/UI/Card.jsx';
import Badge from '../../components/UI/Badge.jsx';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: interviews } = useSelector(state => state.interviews);

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const stats = [
    {
      title: 'Assigned Candidates',
      value: interviews.filter(i => i.companyId === user._id).length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Reviews',
      value: interviews.filter(i => i.status === 'scheduled').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Completed Interviews',
      value: interviews.filter(i => i.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's a look at your assigned candidates and interview pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Interviews</h2>
          <div className="space-y-4">
            {interviews.filter(i => i.companyId === user._id).slice(0, 5).map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{interview.candidateName}</p>
                    <p className="text-sm text-gray-600">{interview.position}</p>
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

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Review Candidates</span>
            </button>
            <button onClick={() => navigate('/interviewform')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900">Schedule Interview</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;
