import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateProfile } from '../../../store/slices/CandidateSlice/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, data: user, error } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(fetchCandidateProfile());
  }, [dispatch]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
        <div>
          <p className="font-semibold">Full Name:</p>
          <p>{user.name}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="font-semibold">Phone:</p>
          <p>{user.phone || 'Not provided'}</p>
        </div>
        <div>
          <p className="font-semibold">Status:</p>
          <p className="capitalize">{user.status}</p>
        </div>
        <div>
          <p className="font-semibold">Role:</p>
          <p className="capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
