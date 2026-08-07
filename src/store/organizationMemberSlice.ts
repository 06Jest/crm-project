import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  OrganizationMemberState,
  UpdateMemberStatusDTO,
} from "../types/organization.member";

import {
  fetchOrgMembersAPI,
  updateMemberRoleAPI,
  updateMemberStatusAPI,
  removeOrgMemberAPI,
} from "../services/orgMemberService";
import type { Roles } from "../types/global";


const initialState: OrganizationMemberState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};


export const fetchOrgMembers = createAsyncThunk(
  "organizationMembers/fetch-members",
  async (_, thunkAPI) => {

    try {

      return await fetchOrgMembersAPI();

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch members"
      );

    }

  }
);


export const updateMemberRole = createAsyncThunk(
  "organizationMembers/update-role",
  async (
    {
      id,
      role,
    }: {
      id: string;
      role: Roles;
    },
    thunkAPI
  ) => {

    try {

      return await updateMemberRoleAPI(
        id,
        role
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update member role"
      );

    }

  }
);


export const updateMemberStatus = createAsyncThunk(
  "organizationMembers/update-status",
  async (
    {
      id,
      status,
    }: {
      id: string;
      status: UpdateMemberStatusDTO;
    },
    thunkAPI
  ) => {

    try {

      return await updateMemberStatusAPI(
        id,
        status
      );

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to update member status"
      );

    }

  }
);


export const removeOrgMember = createAsyncThunk(
  "organizationMembers/remove-member",
  async (
    id: string,
    thunkAPI
  ) => {

    try {

      await removeOrgMemberAPI(id);

      return id;

    } catch (err) {

      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to remove member"
      );

    }

  }
);


const organizationMemberSlice = createSlice({

  name: "organizationMembers",

  initialState,

  reducers: {

    clearError(state) {
      state.error = null;
    },

    clearMembers(state) {
      state.items = [];
      state.loaded = false;
    },

  },

  extraReducers: (builder) => {

    builder.addCase(
      fetchOrgMembers.pending,
      (state) => {

        state.loading = true;
        state.error = null;

      }
    );

    builder.addCase(
      fetchOrgMembers.fulfilled,
      (state, action) => {

        state.loading = false;
        state.loaded = true;
        state.items = action.payload;

      }
    );

    builder.addCase(
      fetchOrgMembers.rejected,
      (state, action) => {

        state.loading = false;
        state.error = action.payload as string;

      }
    );



    builder.addCase(
      updateMemberRole.fulfilled,
      (state, action) => {

        const index =
          state.items.findIndex(
            member => member.id === action.payload.id
          );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

      }
    );

    builder.addCase(
      updateMemberRole.rejected,
      (state, action) => {

        state.error = action.payload as string;

      }
    );



    builder.addCase(
      updateMemberStatus.fulfilled,
      (state, action) => {

        const index =
          state.items.findIndex(
            member => member.id === action.payload.id
          );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

      }
    );

    builder.addCase(
      updateMemberStatus.rejected,
      (state, action) => {

        state.error = action.payload as string;

      }
    );



    builder.addCase(
      removeOrgMember.fulfilled,
      (state, action) => {

        state.items =
          state.items.filter(
            member => member.id !== action.payload
          );

      }
    );

    builder.addCase(
      removeOrgMember.rejected,
      (state, action) => {

        state.error = action.payload as string;

      }
    );

  },

});


export const {
  clearError,
  clearMembers,
} = organizationMemberSlice.actions;

export default organizationMemberSlice.reducer;