import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/interviews';

const getAuthHeader = (getState) => {
  const token = getState().auth.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ✅ Fetch all interviews
export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch failed');
    }
  }
);

// ✅ Create interview
export const createInterview = createAsyncThunk(
  'interviews/createInterview',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Creation failed');
    }
  }
);

// ✅ Update interview
export const updateInterview = createAsyncThunk(
  'interviews/updateInterview',
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates, getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update failed');
    }
  }
);

// ✅ Update status only
export const updateInterviewStatus = createAsyncThunk(
  'interviews/updateInterviewStatus',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeader(getState));
      return { id, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Status update failed');
    }
  }
);

// ✅ Delete interview
export const deleteInterview = createAsyncThunk(
  'interviews/deleteInterview',
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader(getState));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete failed');
    }
  }
);

// ✅ Fetch candidates
export const fetchCandidates = createAsyncThunk(
  'interviews/fetchCandidates',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get('/api/candidates', getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch candidates');
    }
  }
);

// ✅ Fetch companies
export const fetchCompanies = createAsyncThunk(
  'interviews/fetchCompanies',
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get('/api/companies', getAuthHeader(getState));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch companies');
    }
  }
);

// ✅ Slice
const interviewSlice = createSlice({
  name: 'interviews',
  initialState: {
    list: [],
    candidates: [],
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Interviews
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createInterview.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        const index = state.list.findIndex(i => i._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateInterviewStatus.fulfilled, (state, action) => {
        const interview = state.list.find(i => i._id === action.payload.id);
        if (interview) {
          interview.status = action.payload.status;
        }
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.list = state.list.filter(i => i._id !== action.payload);
      })

      // Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default interviewSlice.reducer;
