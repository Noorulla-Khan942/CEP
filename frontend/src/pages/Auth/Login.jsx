import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice.js';
import { Users, Building2, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: 'admin@cep.com',
    password: 'password'
  });

  const demoUsers = [
    { role: 'Admin', email: 'admin@cep.com', icon: Shield, color: 'text-purple-600' },
    { role: 'Recruiter', email: 'recruiter@cep.com', icon: Users, color: 'text-blue-600' },
    { role: 'Company', email: 'hr@techcorp.com', icon: Building2, color: 'text-green-600' },
    { role: 'Candidate', email: 'candidate@email.com', icon: UserCheck, color: 'text-orange-600' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(formData));
  };

  const handleDemoLogin = (email) => {
    setFormData({ email, password: 'password' });
    dispatch(loginUser({ email, password: 'password' }));
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

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
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
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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