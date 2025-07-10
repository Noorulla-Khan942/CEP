import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCompany,
  clearCompanyMessages,
  fetchCompanies
} from '../store/slices/companySlice';

const AddCompanyForm = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector(state => state.companies);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    poc_name: '',
    poc_email: '',
    poc_phone: '',
    active: true
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(addCompany(formData)).then(res => {
      if (!res.error) {
        dispatch(fetchCompanies()); // optional: refresh list
        setFormData({
          name: '',
          industry: '',
          location: '',
          website: '',
          poc_name: '',
          poc_email: '',
          poc_phone: '',
          active: true
        });
      }
    });
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearCompanyMessages()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Company</h2>
      {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="url"
          name="website"
          placeholder="Website (https://...)"
          value={formData.website}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          name="poc_name"
          placeholder="Point of Contact Name"
          value={formData.poc_name}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          name="poc_email"
          placeholder="Point of Contact Email"
          value={formData.poc_email}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />
        <input
          type="tel"
          name="poc_phone"
          placeholder="Point of Contact Phone"
          value={formData.poc_phone}
          onChange={handleChange}
          required
          className="border p-3 rounded-lg"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="h-5 w-5"
          />
          <label htmlFor="active" className="text-gray-700">Active</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Company'}
        </button>
      </form>
    </div>
  );
};

export default AddCompanyForm;
