import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createInterview,
  fetchCandidates,
  fetchCompanies,
} from '../store/slices/interviewSlice.js';

const INTERVIEW_TYPES = ['Technical', 'HR Round', 'Managerial', 'Other'];
const INTERVIEW_STATUSES = ['scheduled', 'completed', 'cancelled', 'rescheduled'];

const InterviewForm = () => {
  const dispatch = useDispatch();

  const { candidates, companies, loading, error } = useSelector(
    (state) => state.interviews
  );

  const [form, setForm] = useState({
    candidateId: '',
    companyId: '',
    position: '',
    date: '',
    time: '',
    type: '',
    status: 'scheduled', // default
    interviewer: '',
  });

  useEffect(() => {
    dispatch(fetchCandidates());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInterview(form));
    setForm({
      candidateId: '',
      companyId: '',
      position: '',
      date: '',
      time: '',
      type: '',
      status: 'scheduled',
      interviewer: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow w-full max-w-2xl mx-auto my-4"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Schedule Interview</h2>

      {/* Candidate Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Candidate</label>
        <select
          name="candidateId"
          value={form.candidateId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Candidate</option>
          {candidates.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} (ID: {c._id})
            </option>
          ))}
        </select>
      </div>

      {/* Company Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Company</label>
        <select
          name="companyId"
          value={form.companyId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} (ID: {c._id})
            </option>
          ))}
        </select>
      </div>

      {/* Other Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Position"
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* Type Dropdown */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Interview Type</option>
          {INTERVIEW_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          {INTERVIEW_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>

        <input
          name="interviewer"
          value={form.interviewer}
          onChange={handleChange}
          placeholder="Interviewer Name"
          className="border p-2 rounded "
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 mt-6 rounded hover:bg-blue-700"
      >
        Add Interview
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default InterviewForm;
