import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice.js';
import Layout from './components/Layout/Layout.jsx';
import Login from './pages/Auth/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CandidateList from './pages/Candidates/CandidateList.jsx';
import CompanyList from './pages/Companies/CompanyList.jsx';
import InterviewSchedule from './pages/Interviews/InterviewSchedule.jsx';
import Reports from './pages/Reports/Reports.jsx';
import LoadingSpinner from './components/UI/LoadingSpinner.jsx';
import AddCandidateForm from './models/AddCandidateForm.jsx';
import CandidateView from './pages/Candidates/CandidateView.jsx';
import CandidateEdit from './pages/Candidates/CandidateEdit.jsx';
import AddCompanyForm from './models/AddCompanyForm.jsx';
import InterviewForm from './models/InterviewForm.jsx';
import InterviewView from './pages/Interviews/InterviewView.jsx';
import InterviewEdit from './pages/Interviews/InterviewEdit.jsx';







function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin & Recruiter Routes */}
        {(user?.role === 'admin' || user?.role === 'recruiter') && (
          <>
            <Route path="/candidates" element={<CandidateList />} />
            <Route path='/addcandidateform' element={<AddCandidateForm/>}/>
            <Route path="/candidates/:id" element={<CandidateView />} />
            <Route path="/editcandidate/:id" element={<CandidateEdit />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/interviews" element={<InterviewSchedule />} />
            <Route path='/addcompanyform' element={<AddCompanyForm/>}/>
            <Route path="/interviewform" element={<InterviewForm />} />
            <Route path="/interview/view/:id" element={<InterviewView />} />
            <Route path="/interview/edit/:id" element={<InterviewEdit />} />
          </>
        )}
        
        {/* Admin Only Routes */}
        {user?.role === 'admin' && (
          <Route path="/reports" element={<Reports />} />
        )}
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;