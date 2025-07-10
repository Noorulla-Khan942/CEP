import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Calendar, TrendingUp, Users } from 'lucide-react';
import { fetchInterviews } from '../../store/slices/interviewSlice.js';
import Card from '../../components/UI/Card.jsx';
import Badge from '../../components/UI/Badge.jsx';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: interviews } = useSelector(state => state.interviews);

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const candidateInterviews = interviews.filter(i => i.candidateId === user._id);

  const stats = [
    {
      title: 'Applications',
      value: candidateInterviews.length,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Interviews Scheduled',
      value: candidateInterviews.filter(i => i.status === 'scheduled').length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Profile Views',
      value: 23, // Placeholder, to be replaced by backend value later
      icon: TrendingUp,
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
          Here's the status of your applications.
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

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Interview Schedule</h2>
          <div className="space-y-4">
            {candidateInterviews.slice(0, 5).map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{interview.companyName}</p>
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
      </div>
    </div>
  );
};

export default CandidateDashboard;
