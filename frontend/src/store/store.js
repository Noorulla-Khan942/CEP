// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import candidateSlice from './slices/candidateSlice';
import companySlice from './slices/companySlice';
import interviewSlice from './slices/interviewSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    candidates: candidateSlice,
    companies: companySlice,
    interviews: interviewSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // this is useful only if you plan to use redux-persist
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
