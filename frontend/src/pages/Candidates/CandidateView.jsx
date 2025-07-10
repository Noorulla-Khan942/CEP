// src/pages/CandidateView.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidates } from '../../store/slices/candidateSlice';

const CandidateView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { list: candidates, loading } = useSelector((state) => state.candidates);
  const candidate = candidates.find((c) => c._id === id);

  useEffect(() => {
    if (!candidates.length) {
      dispatch(fetchCandidates());
    }
  }, [dispatch, candidates.length]);

  if (loading || !candidate) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{candidate.name}</h1>
      <p><strong>Email:</strong> {candidate.email}</p>
      <p><strong>Phone:</strong> {candidate.phone}</p>
      <p><strong>Position:</strong> {candidate.position}</p>
      <p><strong>Experience:</strong> {candidate.experience}</p>
      <p><strong>Status:</strong> {candidate.status}</p>
      <p><strong>Company:</strong> {candidate.assignedCompany}</p>
      <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
      <p><strong>Interview Date:</strong> {candidate.interviewDate}</p>
    </div>
  );
};

export default CandidateView;
