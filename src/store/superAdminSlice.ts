import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '../types/profile';

interface SuperAdminState {
  user: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SuperAdminState = {
  user: null,
  token: localStorage.getItem('super_admin_token'),
  isAuthenticated: !!localStorage.getItem('super_admin_token'),
  loading: false,
  error: null,
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    setSuperAdmin: (
      state,
      action: PayloadAction<{ user: Profile; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;

      localStorage.setItem('super_admin_token', action.payload.token);
      localStorage.setItem('super_admin_id', action.payload.user.id);
    },

    clearSuperAdmin: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem('super_admin_token');
      localStorage.removeItem('super_admin_id');
    },

    setSuperAdminError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setSuperAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setSuperAdmin,
  clearSuperAdmin,
  setSuperAdminError,
  setSuperAdminLoading,
} = superAdminSlice.actions;

export default superAdminSlice.reducer;

