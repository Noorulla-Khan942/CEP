import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CandidateProfileForm = ({ userId, onSuccess }) => {
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: '',
    status: 'application_sent',
    assignedCompany: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    fetchProfileIfExists();
  }, [user]);

  const fetchProfileIfExists = async () => {
    try {
      const res = await axios.get(`/api/candidates/${userId}`);
      if (res.data && res.data.name) {
        setFormData(res.data);
        setIsUpdating(true);
      }
    } catch (err) {
      console.log('No existing profile found');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isUpdating) {
        await axios.put(`/api/candidates/${userId}`, formData);
      } else {
        await axios.post('/api/candidates', { ...formData, userId });
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-5 mt-4">
      <h2 className="text-2xl font-semibold">{isUpdating ? 'Update' : 'Submit'} Candidate Profile</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="mt-1 p-2 w-full border bg-gray-100 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Position Applied</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Experience</label>
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Company (optional)</label>
        <input
          type="text"
          name="assignedCompany"
          value={formData.assignedCompany}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Application Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        >
          <option value="application_sent">Application Sent</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview_scheduled">Interview Scheduled</option>
          <option value="offer">Offer</option>
          <option value="joined">Joined</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Saving...' : isUpdating ? 'Update Profile' : 'Create Profile'}
      </button>
    </form>
  );
};

export default CandidateProfileForm;
