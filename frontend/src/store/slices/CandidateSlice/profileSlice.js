// frontend/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk: Fetch current candidate's profile
export const fetchCandidateProfile = createAsyncThunk(
  'profile/fetchCandidateProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/profile/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
