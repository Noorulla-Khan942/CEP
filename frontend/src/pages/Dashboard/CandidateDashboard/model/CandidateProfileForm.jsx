import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCandidateProfile, fetchCandidateProfile, clearProfileError } from '../../../../store/slices/CandidateSlice/profileSlice.js';
import { Check, X } from 'lucide-react';

const CandidateProfileForm = ({ userId, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    data: profile, 
    loading, 
    error 
  } = useSelector(state => state.profile);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    education: '',
    skills: '',
    status: 'application_sent'
  });

  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    dispatch(clearProfileError());
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    dispatch(fetchCandidateProfile(userId));
  }, [dispatch, userId, user]);

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        position: profile.position || '',
        experience: profile.experience || '',
        education: profile.education || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
        status: profile.status || 'application_sent'
      });
    }
  }, [profile]);

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
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Form submitted'); // Debug log
    
    if (!validate()) {
      console.log('Validation failed', errors); // Debug log
      return;
    }

    try {
      console.log('Dispatching update'); // Debug log
      const result = await dispatch(updateCandidateProfile({
        candidateId: userId,
        formData: {
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim())
        }
      })).unwrap();
      
      console.log('Update successful', result); // Debug log
      onSuccess();
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {profile ? 'Update Your Profile' : 'Complete Your Profile'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields remain the same as before */}
        
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"  // Important: type="button" for cancel
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <X size={18} /> Cancel
            </button>
          )}
          <button
            type="submit"  // Important: type="submit" for form submission
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Saving...'
            ) : (
              <>
                <Check size={18} /> {profile ? 'Update Profile' : 'Save Profile'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateProfileForm;