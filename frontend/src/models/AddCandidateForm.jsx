import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addCandidate } from '../store/slices/candidateSlice.js';

const AddCandidateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [companies, setCompanies] = useState([]); // 🆕 Company list
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    assignedCompany: '',
    interviewDate: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 🆕 Fetch companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setMessage('❌ Failed to load company list.');
      }
    };

    fetchCompanies();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const {
      name,
      email,
      phone,
      position,
      experience,
      assignedCompany,
      interviewDate
    } = formData;

    if (!name || !email || !phone || !position || !experience || !assignedCompany || !interviewDate) {
      setMessage('❌ Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      status: formData.status || 'active',
    };

    try {
      const resultAction = await dispatch(addCandidate(payload));

      if (addCandidate.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Failed to add candidate');
      }

      setMessage('✅ Candidate added successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        skills: '',
        assignedCompany: '',
        interviewDate: '',
        status: 'active'
      });

      setTimeout(() => {
        navigate('/candidates');
      }, 1000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">Add New Candidate</h2>

      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
      <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
      <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
      <textarea name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

      {/* 🆕 Dropdown for assignedCompany */}
      <select name="assignedCompany" value={formData.assignedCompany} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2">
        <option value="">Select Assigned Company</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>

      <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />

      <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
        <option value="active">Active</option>
        <option value="interview_scheduled">Interview Scheduled</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      {message && <p className="text-center text-sm text-red-500">{message}</p>}

      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition duration-200 disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Candidate'}
      </button>
    </form>
  );
};

export default AddCandidateForm;
