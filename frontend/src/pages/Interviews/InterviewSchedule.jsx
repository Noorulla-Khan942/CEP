// src/pages/InterviewSchedule.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInterviews,
  updateInterviewStatus,
  updateInterview,
  deleteInterview,
} from '../../store/slices/interviewSlice.js';
import { Calendar, Clock, User, Building2, Plus, Filter, Pencil, Eye, Trash2 } from 'lucide-react';
import Card from '../../components/UI/Card.jsx';
import Badge from '../../components/UI/Badge.jsx';
import { useNavigate } from 'react-router-dom';

const InterviewSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: interviews, loading } = useSelector(state => state.interviews);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const filteredInterviews = interviews.filter(interview =>
    filterStatus === 'all' || interview.status === filterStatus
  );

  const getStatusVariant = (status) => {
    switch (status) {
      case 'scheduled': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'info';
      default: return 'default';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateInterviewStatus({ id, status: newStatus }));
  };



  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      dispatch(deleteInterview(id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Schedule</h1>
          <p className="text-gray-600 mt-1">Manage and track interview appointments</p>
        </div>
        <button
          onClick={() => navigate('/interviewform')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Interviews</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <Card key={interview._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{interview.candidateName}</h3>
                    <p className="text-gray-600">{interview.position}</p>
                  </div>
                  <Badge variant={getStatusVariant(interview.status)}>
                    {interview.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>{interview.companyName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{interview.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{interview.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{interview.interviewer}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col md:flex-row md:items-center gap-2">
                  <Badge variant="secondary" size="small">
                    {interview.type}
                  </Badge>

                 
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <select
                  value={interview.status}
                  onChange={(e) => handleStatusChange(interview._id, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>

                <button
                  onClick={() => navigate(`/interview/view/${interview._id}`)}
                  className="flex items-center space-x-1 text-blue-600 hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => navigate(`/interview/edit/${interview._id}`)}
                  className="flex items-center space-x-1 text-yellow-600 hover:underline"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(interview._id)}
                  className="flex items-center space-x-1 text-red-600 hover:underline"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default InterviewSchedule;
