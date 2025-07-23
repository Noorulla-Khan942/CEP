// profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Fetch authenticated candidate's profile
export const fetchCandidateProfile = createAsyncThunk(
  'profile/fetchCandidateProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${API_BASE_URL}/api/profile/me`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.data) {
        return rejectWithValue('Profile not found');
      }

      // Transform skills array to string for form display
      const profileData = res.data;
      if (Array.isArray(profileData.skills)) {
        profileData.skills = profileData.skills.join(', ');
      }

      return profileData;
    } catch (err) {
      if (err.response?.status === 404) {
        return rejectWithValue('Profile not found');
      }
      return rejectWithValue(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to fetch profile'
      );
    }
  }
);

// Update candidate profile
export const updateCandidateProfile = createAsyncThunk(
  'profile/updateCandidateProfile',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      
      // Prepare payload with skills as array
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };

      const res = await axios.put(`${API_BASE_URL}/api/profile/me`, payload, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          return rejectWithValue('Profile not found');
        }
        if (err.response.status === 400) {
          return rejectWithValue(
            err.response.data?.message ||
            err.response.data?.error || 
            'Invalid profile data'
          );
        }
        return rejectWithValue(
          err.response.data?.message ||
          err.response.data?.error || 
          'Failed to update profile'
        );
      }
      return rejectWithValue(err.message || 'Failed to update profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile Cases
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Profile Cases
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfileError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;