import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Plus, Eye, Edit, Mail, Phone, Trash2, ChevronDown } from 'lucide-react';
import { fetchCandidates, updateCandidateStatus, deleteCandidate } from '../../store/slices/candidateSlice.js';
import Card from '../../components/UI/Card.jsx';
import Badge from '../../components/UI/Badge.jsx';
import { useNavigate } from 'react-router-dom';

const CandidateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: candidates, loading } = useSelector(state => state.candidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const filteredCandidates = (candidates || []).filter(candidate => {
    if (!candidate || !candidate.name || !candidate.position) return false;
    const nameMatch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
    const positionMatch = candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'all' || candidate.status === filterStatus;
    return (nameMatch || positionMatch) && statusMatch;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'interview_scheduled': return 'warning';
      case 'hired': return 'primary';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const handleStatusChange = (candidateId, newStatus) => {
    dispatch(updateCandidateStatus({ id: candidateId, status: newStatus }));
  };

  const handleDelete = (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      dispatch(deleteCandidate(candidateId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Candidate Management</h1>
          <p className="text-gray-600 mt-1">Track and manage all candidate applications</p>
        </div>
        <button 
          onClick={() => navigate('/addcandidateform')} 
          className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:shadow-md bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Candidate</span>
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none block pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
          <div className="text-sm font-medium text-gray-600">Total Candidates</div>
          <div className="text-2xl font-bold text-gray-900">{candidates?.length || 0}</div>
        </Card>
        <Card className="p-4 bg-green-50 border-l-4 border-green-500 hover:bg-green-100 transition-colors">
          <div className="text-sm font-medium text-gray-600">Active</div>
          <div className="text-2xl font-bold text-gray-900">
            {candidates?.filter(c => c.status === 'active').length || 0}
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50 border-l-4 border-yellow-500 hover:bg-yellow-100 transition-colors">
          <div className="text-sm font-medium text-gray-600">Interviews</div>
          <div className="text-2xl font-bold text-gray-900">
            {candidates?.filter(c => c.status === 'interview_scheduled').length || 0}
          </div>
        </Card>
        <Card className="p-4 bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100 transition-colors">
          <div className="text-sm font-medium text-gray-600">Hired</div>
          <div className="text-2xl font-bold text-gray-900">
            {candidates?.filter(c => c.status === 'hired').length || 0}
          </div>
        </Card>
        <Card className="p-4 bg-purple-50 border-l-4 border-red-500 hover:bg-purple-100 transition-colors">
          <div className="text-sm font-medium text-gray-600">Rejected</div>
          <div className="text-2xl font-bold text-gray-900">
            {candidates?.filter(c => c.status === 'rejected').length || 0}
          </div>
        </Card>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate._id} className="hover:shadow-md transition-all duration-200 border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200">
            <div className="p-5">
              {/* Candidate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-blue-600 font-medium text-lg">
                      {candidate.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate(`/candidates/${candidate._id}`)}>
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">{candidate.position}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(candidate.status)} className="px-2.5 py-0.5 text-xs">
                  {candidate.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Candidate Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Experience:</span> 
                  <span>{candidate.experience} years</span>
                </div>
                {candidate.assignedCompany && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">Company:</span> 
                    <span className="truncate">{candidate.assignedCompany}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" size="small" className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="default" size="small" className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                      +{candidate.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2 gap-8">
                  <button
                    onClick={() => navigate(`/candidates/${candidate._id}`)}
                    className="p-2 bg-gray-50 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/editcandidate/${candidate._id}`)}
                    className="p-2 bg-gray-50 hover:bg-yellow-50 rounded-lg text-gray-600 hover:text-yellow-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(candidate._id)}
                    className="p-2 bg-gray-50 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
 </div>
                <div className='mt-3'>
             <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                <select
                  value={candidate.status}
                  onChange={(e) => handleStatusChange(candidate._id, e.target.value)}
                  className="w-full sm:w-auto text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <Card className="text-center py-16 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search or filter criteria. If you're expecting candidates, 
            make sure they've been properly added to the system.
          </p>
          <button 
            onClick={() => navigate('/addcandidateform')} 
            className="mt-4 btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg mx-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Candidate</span>
          </button>
        </Card>
      )}
    </div>
  );
};

export default CandidateList;