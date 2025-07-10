import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, updateCompany, deleteCompany, addCompany } from '../../store/slices/companySlice.js';
import { Search, Building2, MapPin, Edit2, Trash2, Check, X, Plus } from 'lucide-react';
import Card from '../../components/UI/Card.jsx';
import Badge from '../../components/UI/Badge.jsx';

const CompanyList = () => {
  const dispatch = useDispatch();
  const { list: companies, loading, error, successMessage } = useSelector((state) => state.companies);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing states
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    poc_name: '',
    poc_email: '',
    poc_phone: '',
    active: true,
    candidates: 0,
    active_jobs: 0,
    rate: '$85 pn'
  });

  // Add company states
  const [adding, setAdding] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    poc_name: '',
    poc_email: '',
    poc_phone: '',
    active: true,
    candidates: 0,
    active_jobs: 0,
    rate: '$85 pn'
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit handlers
  const startEdit = (company) => {
    setEditingId(company._id);
    setEditFormData({
      name: company.name || '',
      industry: company.industry || '',
      location: company.location || '',
      website: company.website || '',
      poc_name: company.poc_name || '',
      poc_email: company.poc_email || '',
      poc_phone: company.poc_phone || '',
      active: company.active ?? true,
      candidates: company.candidates || 0,
      active_jobs: company.active_jobs || 0,
      rate: company.rate || '$85 pn'
    });
    // Close add form if open
    setAdding(false);
    setAddError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveEdit = async () => {
    try {
      await dispatch(updateCompany({ id: editingId, data: editFormData })).unwrap();
      setEditingId(null);
    } catch (error) {
      alert('Failed to update company: ' + error);
      console.error('Update error:', error);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await dispatch(deleteCompany(id)).unwrap();
      } catch (error) {
        alert('Failed to delete company: ' + error);
        console.error('Delete error:', error);
      }
    }
  };

  // Add handlers
  const openAddForm = () => {
    setAdding(true);
    setEditingId(null);
    setAddError(null);
    setAddFormData({
      name: '',
      industry: '',
      location: '',
      website: '',
      poc_name: '',
      poc_email: '',
      poc_phone: '',
      active: true,
      candidates: 0,
      active_jobs: 0,
      rate: '$85 pn'
    });
  };

  const cancelAdd = () => {
    setAdding(false);
    setAddError(null);
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveAdd = async () => {
    setAddLoading(true);
    setAddError(null);
    try {
      await dispatch(addCompany(addFormData)).unwrap();
      setAdding(false);
      setAddLoading(false);
      setAddFormData({
        name: '',
        industry: '',
        location: '',
        website: '',
        poc_name: '',
        poc_email: '',
        poc_phone: '',
        active: true,
        candidates: 0,
        active_jobs: 0,
        rate: '$85 pn'
      });
    } catch (error) {
      setAddError(error);
      setAddLoading(false);
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
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage client companies and partnerships</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Add Company Form */}
      {adding && (
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
          <div className="space-y-3 mb-4">
            <input
              type="text"
              name="name"
              value={addFormData.name}
              onChange={handleAddChange}
              placeholder="Company Name"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="industry"
              value={addFormData.industry}
              onChange={handleAddChange}
              placeholder="Industry"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="location"
              value={addFormData.location}
              onChange={handleAddChange}
              placeholder="Location"
              className="border p-2 rounded w-full"
            />
            <input
              type="url"
              name="website"
              value={addFormData.website}
              onChange={handleAddChange}
              placeholder="Website"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="poc_name"
              value={addFormData.poc_name}
              onChange={handleAddChange}
              placeholder="Point of Contact Name"
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="poc_email"
              value={addFormData.poc_email}
              onChange={handleAddChange}
              placeholder="Point of Contact Email"
              className="border p-2 rounded w-full"
            />
            <input
              type="tel"
              name="poc_phone"
              value={addFormData.poc_phone}
              onChange={handleAddChange}
              placeholder="Point of Contact Phone"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="candidates"
              value={addFormData.candidates}
              onChange={handleAddChange}
              placeholder="Number of Candidates"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              name="active_jobs"
              value={addFormData.active_jobs}
              onChange={handleAddChange}
              placeholder="Active Jobs"
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="rate"
              value={addFormData.rate}
              onChange={handleAddChange}
              placeholder="Rate (e.g. $85 pn)"
              className="border p-2 rounded w-full"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={addFormData.active}
                onChange={handleAddChange}
                className="h-5 w-5"
              />
              Active
            </label>
            {addError && <p className="text-red-600">{addError}</p>}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={saveAdd}
              disabled={addLoading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {addLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancelAdd}
              disabled={addLoading}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company._id} className="hover:shadow-lg transition-shadow duration-300">
            {editingId === company._id ? (
              <>
                {/* Editable Form */}
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    placeholder="Company Name"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="industry"
                    value={editFormData.industry}
                    onChange={handleEditChange}
                    placeholder="Industry"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditChange}
                    placeholder="Location"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="url"
                    name="website"
                    value={editFormData.website}
                    onChange={handleEditChange}
                    placeholder="Website"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="poc_name"
                    value={editFormData.poc_name}
                    onChange={handleEditChange}
                    placeholder="Point of Contact Name"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="email"
                    name="poc_email"
                    value={editFormData.poc_email}
                    onChange={handleEditChange}
                    placeholder="Point of Contact Email"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="tel"
                    name="poc_phone"
                    value={editFormData.poc_phone}
                    onChange={handleEditChange}
                    placeholder="Point of Contact Phone"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="number"
                    name="candidates"
                    value={editFormData.candidates}
                    onChange={handleEditChange}
                    placeholder="Number of Candidates"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="number"
                    name="active_jobs"
                    value={editFormData.active_jobs}
                    onChange={handleEditChange}
                    placeholder="Active Jobs"
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="rate"
                    value={editFormData.rate}
                    onChange={handleEditChange}
                    placeholder="Rate (e.g. $85 pn)"
                    className="border p-2 rounded w-full"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={editFormData.active}
                      onChange={handleEditChange}
                      className="h-5 w-5"
                    />
                    Active
                  </label>
                </div>
                {/* Save / Cancel Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>
                  <Badge variant={company.active ? 'success' : 'destructive'}>
                    {company.active ? 'active' : 'inactive'}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Contact:</span> {company.poc_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {company.poc_email}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {company.poc_phone}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Candidates:</span> {company.candidates || 0}
                    </div>
                    <div>
                      <span className="font-medium">Active Jobs:</span> {company.active_jobs || 0}
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span> {company.rate || '$85 pn'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(company)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CompanyList;