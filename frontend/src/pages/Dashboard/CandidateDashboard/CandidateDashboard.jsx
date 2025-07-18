import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Outlet } from 'react-router-dom';
import { Calendar, Megaphone, CheckCircle } from 'lucide-react';
import axios from 'axios';

import { fetchInterviews } from '../../../store/slices/interviewSlice.js';
import { fetchCandidateProfile } from '../../../store/slices/CandidateSlice/profileSlice.js';
import Card from '../../../components/UI/Card.jsx';
import Badge from '../../../components/UI/Badge.jsx';
import CandidateProfileForm from './model/CandidateProfileForm.jsx';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { list: interviews } = useSelector(state => state.interviews);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchInterviews());
      checkProfileExists();
    }
  }, [dispatch, user]);

  const checkProfileExists = async () => {
    try {
      const res = await axios.get(`/api/candidates/${user._id}`);
      if (res.data && res.data.name) {
        setProfileExists(true);
        setShowProfileForm(false);
      } else {
        setProfileExists(false);
      }
    } catch (err) {
      console.error('Profile check failed:', err);
      setProfileExists(false);
    }
  };

  const candidateInterviews = interviews.filter(i => i.candidateId === user._id);

  const statusMap = {
    'Application Sent': 'application_sent',
    'Shortlisted': 'shortlisted',
    'Interview Scheduled': 'interview_scheduled',
    'Offer': 'offer',
    'Joined': 'joined',
    'Rejected': 'rejected',
  };

  const stats = Object.entries(statusMap).map(([label, key]) => ({
    title: label,
    value: candidateInterviews.filter(i => i.status === key).length,
    icon: CheckCircle,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  }));

  const isSubRoute = ['/candidate/profile', '/candidate/interview', '/candidate/messages'].some(path =>
    location.pathname.startsWith(path)
  );

  if (isSubRoute) return <Outlet />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Track your job application journey.</p>
      </div>

      {!profileExists && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowProfileForm(prev => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showProfileForm ? 'Hide Profile Form' : 'Complete My Profile'}
          </button>
        </div>
      )}

      {showProfileForm && !profileExists && (
        <CandidateProfileForm
          userId={user._id}
          onSuccess={() => {
            setProfileExists(true);
            setShowProfileForm(false);
            dispatch(fetchCandidateProfile());
          }}
        />
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6">
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

      {/* Interview Schedule */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Interview Schedule</h2>
        {candidateInterviews.filter(i => i.status === 'interview_scheduled').length === 0 ? (
          <p className="text-gray-600">No interviews scheduled yet.</p>
        ) : (
          candidateInterviews
            .filter(i => i.status === 'interview_scheduled')
            .slice(0, 5)
            .map(interview => (
              <div key={interview._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{interview.companyName}</p>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="warning">{interview.status.replace(/_/g, ' ')}</Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(interview.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
        )}
      </Card>

      {/* Feedback Section */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recruiter Feedback</h2>
        {candidateInterviews.filter(i => i.feedback && i.feedbackVisible).length === 0 ? (
          <p className="text-gray-600">No feedback visible at the moment.</p>
        ) : (
          candidateInterviews
            .filter(i => i.feedback && i.feedbackVisible)
            .map((i, idx) => (
              <div key={idx} className="mb-4 p-4 rounded bg-gray-50">
                <p className="font-semibold">{i.companyName}</p>
                <p className="text-sm text-gray-700 mt-1">{i.feedback}</p>
              </div>
            ))
        )}
      </Card>

      {/* Availability & Withdraw */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability & Process Options</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update Availability
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Withdraw Application
          </button>
        </div>
      </Card>

      {/* Notification Center */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> Notification Center
        </h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>Recruiter sent you a message: “Please update your availability.”</li>
          <li>Your interview with ABC Corp has been rescheduled.</li>
          <li>New opportunity at XYZ Inc. added to your profile.</li>
        </ul>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
