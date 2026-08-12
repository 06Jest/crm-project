import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  CompleteProfileDTO,
  UpdateProfileDTO,
  ProfileStatus,
  ProfileState,
} from "../types/profile";

import {
  fetchProfileAPI,
  completeProfileSetupAPI,
  updateProfileAPI,
  updateProfileAvatarAPI,
  updateProfileStatusAPI,
} from "../services/profileService";

const initialState: ProfileState = {
  profile: null,
  loading: false,
  loaded: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch-profile",
  async (_, thunkAPI) => {
    try {
      return await fetchProfileAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch profile"
      );
    }
  }
);

export const completeProfileSetup = createAsyncThunk(
  "profile/complete-setup",
  async (
    profile: CompleteProfileDTO,
    thunkAPI
  ) => {
    try {
      return await completeProfileSetupAPI(profile);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to complete profile setup"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update-profile",
  async (
    profile: UpdateProfileDTO,
    thunkAPI
  ) => {
    try {
      return await updateProfileAPI(profile);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update profile"
      );
    }
  }
);

export const updateProfileAvatar = createAsyncThunk(
  "profile/update-avatar",
  async (
    avatar_url: string | null,
    thunkAPI
  ) => {
    try {
      return await updateProfileAvatarAPI(
        avatar_url
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update avatar"
      );
    }
  }
);

export const updateProfileStatus = createAsyncThunk(
  "profile/update-status",
  async (
    status: ProfileStatus,
    thunkAPI
  ) => {
    try {
      return await updateProfileStatusAPI(
        status
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update status"
      );
    }
  }
);

const profileSlice = createSlice({

  name: "profile",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

    clearProfile(state) {
      state.profile = null;
      state.loaded = false;
    },

  },

  extraReducers: (builder) => {

    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.profile = action.payload;
    });

    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(completeProfileSetup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(completeProfileSetup.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.first_name = action.payload.first_name;
      state.profile.last_name = action.payload.last_name;
      state.profile.avatar_url = action.payload.avatar_url;
      state.profile.job_title = action.payload.job_title;
      state.profile.status = action.payload.status;
    });

    builder.addCase(completeProfileSetup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.first_name = action.payload.first_name;
      state.profile.last_name = action.payload.last_name;
      state.profile.display_name = action.payload.display_name;
      state.profile.job_title = action.payload.job_title;
    });

    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(updateProfileAvatar.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfileAvatar.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.avatar_url =
        action.payload.avatar_url ?? undefined;
    });

    builder.addCase(updateProfileAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(updateProfileStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProfileStatus.fulfilled, (state, action) => {
      state.loading = false;

      if (!state.profile) return;

      state.profile.status = action.payload.status;
    });

    builder.addCase(updateProfileStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

  },

});

export const {
  clearError,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;