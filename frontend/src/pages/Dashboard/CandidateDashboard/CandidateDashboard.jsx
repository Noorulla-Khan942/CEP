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
  const { 
    list: interviews = [], 
    loading: interviewsLoading, 
    error: interviewsError 
  } = useSelector(state => state.interviews);
  
  const { 
    data: profile, 
    loading: profileLoading, 
    error: profileError 
  } = useSelector(state => state.profile);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Recruiter sent you a message: 'Please update your availability.'" },
    { id: 2, message: "Your interview with ABC Corp has been rescheduled" },
    { id: 3, message: "New opportunity at XYZ Inc. added to your profile" }
  ]);
  const [apiErrors, setApiErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (user?._id) {
        setIsLoading(true);
        try {
          await Promise.all([
            dispatch(fetchInterviews(user._id)),
            dispatch(fetchCandidateProfile(user._id))
          ]);
        } catch (error) {
          console.error("Failed to load data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [dispatch, user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        params: { userId: user._id },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.warn('Notifications API not available, using mock data');
    }
  };

  const candidateInterviews = interviews.filter(i => i.candidateId === user?._id) || [];

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

  const handleUpdateAvailability = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/candidates/${user._id}/availability`, {
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        alert('Availability updated successfully!');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setApiErrors('Failed to update availability. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (!applicationId) {
      setApiErrors('No application selected');
      return;
    }

    if (window.confirm('Are you sure you want to withdraw this application?')) {
      setIsLoading(true);
      try {
        await axios.delete(`/api/applications/${applicationId}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        dispatch(fetchInterviews(user._id));
        alert('Application withdrawn successfully');
      } catch (error) {
        console.error('Error withdrawing application:', error);
        setApiErrors('Failed to withdraw application. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isSubRoute) return <Outlet />;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (interviewsError || profileError || apiErrors) {
    const errorMessage = interviewsError?.message || profileError?.message || apiErrors;
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
          <button 
            onClick={() => setApiErrors(null)} 
            className="absolute top-0 right-0 px-2 py-1"
          >
            &times;
          </button>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Track your job application journey.</p>
        </div>
        {!profile && !profileLoading && (
          <button
            onClick={() => setShowProfileForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Complete My Profile'}
          </button>
        )}
      </div>

      {showProfileForm && (
        <CandidateProfileForm
          userId={user._id}
          onSuccess={() => {
            setShowProfileForm(false);
            dispatch(fetchCandidateProfile(user._id));
          }}
          onCancel={() => setShowProfileForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition duration-200">
            <div className="flex items-center">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="hover:shadow-lg transition duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Interview Schedule</h2>
        {candidateInterviews.filter(i => i.status === 'interview_scheduled').length === 0 ? (
          <p className="text-gray-600">No interviews scheduled yet.</p>
        ) : (
          <div className="space-y-3">
            {candidateInterviews
              .filter(i => i.status === 'interview_scheduled')
              .slice(0, 5)
              .map(interview => (
                <div key={interview._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
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
              ))}
          </div>
        )}
      </Card>

      <Card className="hover:shadow-lg transition duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recruiter Feedback</h2>
        {candidateInterviews.filter(i => i.feedback && i.feedbackVisible).length === 0 ? (
          <p className="text-gray-600">No feedback visible at the moment.</p>
        ) : (
          <div className="space-y-3">
            {candidateInterviews
              .filter(i => i.feedback && i.feedbackVisible)
              .map((i, idx) => (
                <div key={idx} className="p-4 rounded bg-gray-50 hover:bg-gray-100 transition duration-200">
                  <p className="font-semibold">{i.companyName}</p>
                  <p className="text-sm text-gray-700 mt-1">{i.feedback}</p>
                </div>
              ))}
          </div>
        )}
      </Card>

      <Card className="hover:shadow-lg transition duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability & Process Options</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleUpdateAvailability}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Update Availability'}
          </button>
          {candidateInterviews.length > 0 && (
            <button 
              onClick={() => handleWithdrawApplication(candidateInterviews[0]._id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Withdraw Application'}
            </button>
          )}
        </div>
      </Card>

      <Card className="hover:shadow-lg transition duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> Notification Center
        </h2>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          {notifications.map((notification) => (
            <li key={notification.id} className="hover:text-gray-900 transition duration-200">
              {notification.message}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CandidateDashboard;