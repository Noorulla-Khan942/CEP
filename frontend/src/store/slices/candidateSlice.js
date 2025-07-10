import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base API URL
const API_URL = 'http://localhost:5000/api/candidates';

// Fetch all candidates
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch candidates');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Add a new candidate thunk
export const addCandidate = createAsyncThunk(
  'candidates/addCandidate',
  async (candidateData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(candidateData), // Ensure assignedCompany is an ObjectId here
      });

      const data = await response.json();

      // If not successful, throw custom error
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to add candidate');
      }

      // Backend already sends the created candidate object
      return {
        candidate: data,
        message: '✅ Candidate added and onboarding email, notification, and interview invite sent successfully.',
      };
    } catch (error) {
      return rejectWithValue(
        error.message || '❌ Network error: Unable to add candidate'
      );
    }
  }
);


// Update candidate
export const updateCandidate = createAsyncThunk(
  'candidates/updateCandidate',
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update candidate');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update only candidate status
export const updateCandidateStatus = createAsyncThunk(
  'candidates/updateCandidateStatus',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update status');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete candidate
export const deleteCandidate = createAsyncThunk(
  'candidates/deleteCandidate',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete candidate');
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const candidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedCandidate: null
  },
  reducers: {
    selectCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCandidate.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCandidate.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.list[index].status = action.payload.status;
      })
      .addCase(updateCandidateStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c._id !== action.payload.id);
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { selectCandidate } = candidateSlice.actions;
export default candidateSlice.reducer;