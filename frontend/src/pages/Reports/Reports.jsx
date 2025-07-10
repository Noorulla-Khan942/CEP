import React from 'react';
import { BarChart3, TrendingUp, Users, Building2, Calendar, Award } from 'lucide-react';
import Card from '../../components/UI/Card.jsx';

const Reports = () => {
  const reportData = {
    totalCandidates: 145,
    activeCandidates: 89,
    totalCompanies: 23,
    activeCompanies: 18,
    interviewsThisMonth: 34,
    placementsThisMonth: 12,
    placementRate: 78,
    averageTimeToHire: 18
  };

  const recentPlacements = [
    { candidateName: 'Alice Johnson', companyName: 'Tech Corp', position: 'Frontend Developer', date: '2024-01-15' },
    { candidateName: 'Bob Smith', companyName: 'StartupX', position: 'Backend Developer', date: '2024-01-12' },
    { candidateName: 'Carol Wilson', companyName: 'InnovateLab', position: 'UX Designer', date: '2024-01-10' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Track performance and recruitment metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p  className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalCandidates}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Companies</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.activeCompanies}</p>
              <p className="text-sm text-green-600">+2 new this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.interviewsThisMonth}</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Placement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.placementRate}%</p>
              <p className="text-sm text-green-600">+5% improvement</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Performance Overview */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Placement Rate</span>
                  <span className="text-sm font-bold text-gray-900">{reportData.placementRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full" 
                    style={{ width: `${reportData.placementRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Active Candidates</span>
                  <span className="text-sm font-bold text-gray-900">
                    {reportData.activeCandidates} / {reportData.totalCandidates}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${(reportData.activeCandidates / reportData.totalCandidates) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Active Companies</span>
                  <span className="text-sm font-bold text-gray-900">
                    {reportData.activeCompanies} / {reportData.totalCompanies}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-secondary-500 h-2 rounded-full" 
                    style={{ width: `${(reportData.activeCompanies / reportData.totalCompanies) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Placements */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Placements</h2>
            
            <div className="space-y-4">
              {recentPlacements.map((placement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{placement.candidateName}</p>
                    <p className="text-sm text-gray-600">{placement.position} at {placement.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{placement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="p-6 text-center">
          <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Time to Hire</h3>
          <p className="text-3xl font-bold text-primary-600">{reportData.averageTimeToHire}</p>
          <p className="text-sm text-gray-600">days</p>
        </Card>

        <Card className="p-6 text-center">
          <Calendar className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interviews This Month</h3>
          <p className="text-3xl font-bold text-secondary-600">{reportData.interviewsThisMonth}</p>
          <p className="text-sm text-gray-600">scheduled</p>
        </Card>

        <Card className="p-6 text-center">
          <Award className="w-12 h-12 text-success-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Placements This Month</h3>
          <p className="text-3xl font-bold text-success-600">{reportData.placementsThisMonth}</p>
          <p className="text-sm text-gray-600">successful</p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;