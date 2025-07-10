import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchInterviews, updateInterview } from '../../store/slices/interviewSlice.js';

const INTERVIEW_TYPES = ['Technical', 'HR Round', 'Managerial', 'Other'];
const INTERVIEW_STATUSES = ['scheduled', 'completed', 'cancelled', 'rescheduled'];

const InterviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const interview = useSelector(state =>
    state.interviews.list.find(i => i._id === id)
  );

  const [form, setForm] = useState({});

  useEffect(() => {
    if (!interview) {
      dispatch(fetchInterviews());
    } else {
      setForm({ ...interview });
    }
  }, [dispatch, interview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateInterview({ id, updates: form }));
    navigate('/interviews');
  };

  if (!form._id) return <div className="text-center py-10">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Interview</h2>

      <input
        name="candidateName"
        value={form.candidateName}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
        placeholder="Candidate Name"
      />

      <input
        name="companyName"
        value={form.companyName}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
        placeholder="Company Name"
      />

      <input
        name="position"
        value={form.position}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
        placeholder="Position"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
      >
        <option value="" disabled>Select Interview Type</option>
        {INTERVIEW_TYPES.map(type => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <input
        name="interviewer"
        value={form.interviewer}
        onChange={handleChange}
        className="border p-2 rounded mb-2 w-full"
        required
        placeholder="Interviewer Name"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 rounded mb-4 w-full"
        required
      >
        <option value="" disabled>Select Status</option>
        {INTERVIEW_STATUSES.map(status => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Update Interview
      </button>
    </form>
  );
};

export default InterviewEdit;
