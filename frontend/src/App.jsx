import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice.js';

import Layout from './components/Layout/Layout.jsx';
import Login from './pages/Auth/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';

// Admin & Recruiter Pages
import CandidateList from './pages/Candidates/CandidateList.jsx';
import AddCandidateForm from './models/AddCandidateForm.jsx';
import CandidateView from './pages/Candidates/CandidateView.jsx';
import CandidateEdit from './pages/Candidates/CandidateEdit.jsx';
import CompanyList from './pages/Companies/CompanyList.jsx';
import AddCompanyForm from './models/AddCompanyForm.jsx';
import InterviewSchedule from './pages/Interviews/InterviewSchedule.jsx';
import InterviewForm from './models/InterviewForm.jsx';
import InterviewView from './pages/Interviews/InterviewView.jsx';
import InterviewEdit from './pages/Interviews/InterviewEdit.jsx';
import Reports from './pages/Reports/Reports.jsx';

// Candidate Dashboard Components
import CandidateDashboard from './pages/Dashboard/CandidateDashboard/CandidateDashboard.jsx';
import Profile from './pages/Dashboard/CandidateDashboard/Profile.jsx';
import Interviews from './pages/Dashboard/CandidateDashboard/Interviews.jsx';
import Messages from './pages/Dashboard/CandidateDashboard/Messages.jsx';
import CandidateProfileForm from './pages/Dashboard/CandidateDashboard/model/CandidateProfileForm.jsx';

import LoadingSpinner from './components/UI/LoadingSpinner.jsx';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Login />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin & Recruiter Routes */}
        {(user?.role === 'admin' || user?.role === 'recruiter') && (
          <>
            <Route path="/candidates" element={<CandidateList />} />
            <Route path="/addcandidateform" element={<AddCandidateForm />} />
            <Route path="/candidates/:id" element={<CandidateView />} />
            <Route path="/editcandidate/:id" element={<CandidateEdit />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/addcompanyform" element={<AddCompanyForm />} />
            <Route path="/interviews" element={<InterviewSchedule />} />
            <Route path="/interviewform" element={<InterviewForm />} />
            <Route path="/interview/view/:id" element={<InterviewView />} />
            <Route path="/interview/edit/:id" element={<InterviewEdit />} />
            <Route path="/reports" element={<Reports />} />
          </>
        )}

        {/* Candidate Routes */}
        {user?.role === 'candidate' && (
          <Route path="/candidate/*" element={<CandidateDashboard />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/add" element={<CandidateProfileForm />} /> {/* ✅ Fixed path */}
            <Route path="interview" element={<Interviews />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
