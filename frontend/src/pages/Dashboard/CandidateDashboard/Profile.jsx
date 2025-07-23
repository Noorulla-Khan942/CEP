import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateProfile, clearProfileError } from '../../../store/slices/CandidateSlice/profileSlice';
import { Pencil, Check, X } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, data: profile, error } = useSelector(state => state.profile);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    education: ''
  });

  useEffect(() => {
    dispatch(fetchCandidateProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
        experience: profile.experience || '',
        education: profile.education || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setEditMode(false);
  };

  if (loading) return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
      <button
        onClick={() => {
          dispatch(clearProfileError());
          dispatch(fetchCandidateProfile());
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} /> Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              <X size={18} /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Check size={18} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div>
            <p className="font-semibold text-gray-600">Full Name:</p>
            <p className="text-lg">{profile.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Email:</p>
            <p className="text-lg">{profile.email}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Phone:</p>
            <p className="text-lg">{profile.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Status:</p>
            <p className="text-lg capitalize">{profile.status?.replace('_', ' ') || 'Unknown'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Skills:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(profile.skills) ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills listed</span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Experience:</p>
            <p className="whitespace-pre-line">{profile.experience || 'Not provided'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Education:</p>
            <p className="whitespace-pre-line">{profile.education || 'Not provided'}</p>
          </div>
          {profile.assignedCompany && (
            <div>
              <p className="font-semibold text-gray-600">Assigned Company:</p>
              <p className="text-lg">{profile.assignedCompany.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;