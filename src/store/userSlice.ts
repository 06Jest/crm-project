import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signInAPI, changePasswordAPI, getCurrentUserAPI,  signOutAPI, signUpAPI } from '../services/authService';
import type { ChangePasswordDTO, SignInDTO, SignUpDTO, UserState } from '../types/auth';

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  loaded: false,
  error: null,
};

export const signUp = createAsyncThunk(
  "auth/signup",
  async (dto: SignUpDTO, thunkAPI) => {
    try {
      return await signUpAPI(dto);

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to sign up user"
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      return await getCurrentUserAPI();

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to get current user"
      );
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signin",
  async (dto: SignInDTO, thunkAPI) => {
    try {
      return await signInAPI(dto);

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to sign in user"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/change-password",
  async (dto: ChangePasswordDTO, thunkAPI) => {
    try {
      return await changePasswordAPI(dto);

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to change password"
      );
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signout",
  async (_, thunkAPI) => {
    try {
      return await signOutAPI();

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to sign out user"
      );
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.user = action.payload.profile;
        state.isAuthenticated = true;
      })

      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
        state.user = null;
        state.isAuthenticated = false;
      })


      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.profile;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.loaded = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;

      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 