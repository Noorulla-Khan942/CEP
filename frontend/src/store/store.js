import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/CandidateSlice/profileSlice'; // ✅ correct import
import candidateReducer from './slices/candidateSlice';
import companyReducer from './slices/companySlice';
import interviewReducer from './slices/interviewSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, // ✅ use reducer, not thunk
    candidates: candidateReducer,
    companies: companyReducer,
    interviews: interviewReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Ignore non-serializable checks from thunks
        ignoredActions: [
          'profile/fetchCandidateProfile/pending',
          'profile/fetchCandidateProfile/fulfilled',
          'profile/fetchCandidateProfile/rejected',
          'persist/PERSIST',
        ],
        ignoredPaths: ['profile'],
      },
    }),
});
