import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginUser,
  clearError,
  sendOtp,
  resetPassword,
  resetOtpState
} from '../../store/slices/authSlice.js';
import { Users, Building2, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    error,
    otpSent,
    passwordReset
  } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: 'admin@cep.com',
    password: 'password'
  });

  const [showForgot, setShowForgot] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: '', otp: '', newPassword: '' });

  const demoUsers = [
    { role: 'Admin', email: 'admin@cep.com', icon: Shield, color: 'text-purple-600' },
    { role: 'Recruiter', email: 'recruiter@cep.com', icon: Users, color: 'text-blue-600' },
    { role: 'Company', email: 'hr@techcorp.com', icon: Building2, color: 'text-green-600' },
    { role: 'Candidate', email: 'candidate@email.com', icon: UserCheck, color: 'text-orange-600' }
  ];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(formData));
    if (result.payload) {
      navigate('/dashboard');
    }
  };

  const handleDemoLogin = async (email) => {
    setFormData({ email, password: 'password' });
    const result = await dispatch(loginUser({ email, password: 'password' }));
    if (result.payload) {
      navigate('/dashboard');
    }
  };

  const handleSendOtp = async () => {
    dispatch(clearError());
    await dispatch(sendOtp(otpForm.email));
  };

  const handleResetPassword = async () => {
    dispatch(clearError());
    const result = await dispatch(resetPassword(otpForm));
    if (result.payload) {
      setOtpForm({ email: '', otp: '', newPassword: '' });
      setShowForgot(false);
      dispatch(resetOtpState());
      alert('Password reset successful. Please login.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CEP</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Candidate Engagement Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {showForgot ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2">Reset Password</h2>

              <input
                type="email"
                placeholder="Enter your email"
                value={otpForm.email}
                onChange={(e) => setOtpForm({ ...otpForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full btn-primary py-2"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpForm.otp}
                    onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={otpForm.newPassword}
                    onChange={(e) => setOtpForm({ ...otpForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleResetPassword}
                    className="w-full btn-primary py-2"
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setShowForgot(false);
                  dispatch(clearError());
                }}
                className="text-sm text-gray-600 hover:underline text-center block mt-2"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  className="text-primary-600 hover:underline text-sm"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Demo Users */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Demo Users</h3>
          <div className="grid grid-cols-2 gap-3">
            {demoUsers.map((user) => {
              const Icon = user.icon;
              return (
                <button
                  key={user.role}
                  onClick={() => handleDemoLogin(user.email)}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  <Icon className={`w-4 h-4 ${user.color}`} />
                  <span className="text-sm font-medium text-gray-700">{user.role}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Click any role to login as demo user (password: password)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
