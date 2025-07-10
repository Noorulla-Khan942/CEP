// Dashboard.jsx (Role-Based Wrapper)
import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './AdminDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import CompanyDashboard from './CompanyDashboard';
import CandidateDashboard from './CandidateDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'company':
      return <CompanyDashboard />;
    case 'candidate':
      return <CandidateDashboard />;
    default:
      return <div>Invalid Role</div>;
  }
};

export default Dashboard;