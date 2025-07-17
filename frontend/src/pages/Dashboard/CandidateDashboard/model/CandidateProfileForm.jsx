import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CandidateProfileForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    interviewDate: '',
    assignedCompanyId: '',
  });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error('Failed to load companies', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      candidateId: userId,
      skills: formData.skills.split(',').map(s => s.trim()),
      assignedCompany: formData.assignedCompanyId,
    };

    try {
      await axios.post('/api/candidates', payload);
      alert('Profile submitted successfully!');
      onSuccess(); // inform parent
    } catch (err) {
      console.error('Profile submission failed:', err);
      alert('Error saving profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Profile</h2>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="input" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input" required />
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="input" required />
      <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position (e.g., MERN Developer)" className="input" />
      <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (e.g., 2.7 years)" className="input" />
      <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma-separated)" className="input" />
      <label className="block text-sm text-gray-700 font-medium">Interview Date</label>
      <input type="datetime-local" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="input" />
      <label className="block text-sm text-gray-700 font-medium">Assigned Company</label>
      {/* <select name="assignedCompanyId" value={formData.assignedCompanyId} onChange={handleChange} className="input" required>
        <option value="">-- Select Company --</option>
        {companies.map(company => (
          <option key={company._id} value={company._id}>{company.name}</option>
        ))}
      </select> */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
};

export default CandidateProfileForm;
