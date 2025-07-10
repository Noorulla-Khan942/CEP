// InterviewView.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviews } from '../../store/slices/interviewSlice.js';
import Card from '../../components/UI/Card.jsx';

const InterviewView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const interview = useSelector(state =>
    state.interviews.list.find(i => i._id === id)
  );

  useEffect(() => {
    if (!interview) {
      dispatch(fetchInterviews());
    }
  }, [dispatch, interview]);

  if (!interview) return <div className="text-center py-10">Loading...</div>;

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Interview Details</h2>
      <div className="space-y-2">
        <p><strong>Candidate:</strong> {interview.candidateName}</p>
        <p><strong>Company:</strong> {interview.companyName}</p>
        <p><strong>Position:</strong> {interview.position}</p>
        <p><strong>Date:</strong> {interview.date}</p>
        <p><strong>Time:</strong> {interview.time}</p>
        <p><strong>Type:</strong> {interview.type}</p>
        <p><strong>Interviewer:</strong> {interview.interviewer}</p>
        <p><strong>Status:</strong> {interview.status}</p>
      </div>
    </Card>
  );
};

export default InterviewView;