// store/slices/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/companies';

// Fetch all companies
export const fetchCompanies = createAsyncThunk('companies/fetch', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch companies');
  }
});

// Add new company
export const addCompany = createAsyncThunk('companies/add', async (data, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to add company');
  }
});

// Update company
export const updateCompany = createAsyncThunk('companies/update', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update company');
  }
});

// Delete company
export const deleteCompany = createAsyncThunk('companies/delete', async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete company');
  }
});

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    list: [],
    loading: false,
    error: null,
    successMessage: null,
    selectedCompany: null
  },
  reducers: {
    selectCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    clearCompanyMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.selectedCompany = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCompany.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.successMessage = 'Company added successfully';
        state.loading = false;
      })
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
        state.successMessage = 'Company updated successfully';
        state.loading = false;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c._id !== action.payload);
        state.successMessage = 'Company deleted successfully';
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { selectCompany, clearCompanyMessages } = companySlice.actions;
export default companySlice.reducer;
