import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adminSignInAPI, agentSignInAPI, changePasswordAPI, getCurrentUserAPI, refreshAPI, signOutAPI, signUpAPI } from '../services/authService';
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
        "Failed to sign in user"
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

export const adminSignIn = createAsyncThunk(
  "auth/admin-signin",
  async (dto: SignInDTO, thunkAPI) => {
    try {
      return await adminSignInAPI(dto);

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

export const agentSignIn = createAsyncThunk(
  "auth/agent-signin",
  async (dto: SignInDTO, thunkAPI) => {
    try {
      return await agentSignInAPI(dto);

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
        "Failed to sign in user"
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

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      return await refreshAPI();

    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to refresh token"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
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
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
        state.user = null;
        state.isAuthenticated = false;
      })


      .addCase(adminSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(adminSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(adminSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(agentSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agentSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(agentSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        console.log("LOGOUT FULFILLED");
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


      .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state) => {
        state.loading = false;
        state.loaded = true;
        state.isAuthenticated = true;

      })
      .addCase(refresh.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;