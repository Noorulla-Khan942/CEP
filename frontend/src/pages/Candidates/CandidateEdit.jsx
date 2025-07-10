// src/pages/CandidateEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidates, updateCandidate } from '../../store/slices/candidateSlice';

const CandidateEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: candidates, loading } = useSelector((state) => state.candidates);
  const candidate = candidates.find((c) => c._id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    status: 'active',
    assignedCompany: '',
    interviewDate: '',
    skills: []
  });

  useEffect(() => {
    if (!candidates.length) {
      dispatch(fetchCandidates());
    }
  }, [dispatch, candidates.length]);

  useEffect(() => {
    if (candidate) {
      setFormData({ ...candidate });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateCandidate({ id, updates: formData })).unwrap();
      navigate('/candidates');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading || !candidate) return <div className="p-8">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Candidate</h2>

      <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2" placeholder="Name" />
      <input name="email" value={formData.email} onChange={handleChange} className="w-full border p-2" placeholder="Email" />
      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2" placeholder="Phone" />
      <input name="position" value={formData.position} onChange={handleChange} className="w-full border p-2" placeholder="Position" />
      <input name="experience" value={formData.experience} onChange={handleChange} className="w-full border p-2" placeholder="Experience" />
      <input name="assignedCompany" value={formData.assignedCompany} onChange={handleChange} className="w-full border p-2" placeholder="Company" />
      <input name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="w-full border p-2" type="date" />

      <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2">
        <option value="active">Active</option>
        <option value="interview_scheduled">Interview Scheduled</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
};

export default CandidateEdit;
