import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  OrganizationInvite,
  CreateInviteDTO,
  AcceptInviteDTO,
} from "../types/organization.invite";

import {
  fetchOrganizationInvitesAPI,
  createOrganizationInviteAPI,
  acceptOrganizationInviteAPI,
  revokeOrganizationInviteAPI,
} from "../services/orgInviteService";

import type { OrganizationMember } from "../types/organization.member";

interface OrganizationInviteState {
  invites: OrganizationInvite[];
  loading: boolean;
  creating: boolean;
  revoking: boolean;
  accepting: boolean;
  error: string | null;
}

const initialState: OrganizationInviteState = {
  invites: [],
  loading: false,
  creating: false,
  revoking: false,
  accepting: false,
  error: null,
};


export const fetchOrgInvites = createAsyncThunk<
  OrganizationInvite[],
  void,
  { rejectValue: string }
>(
  "organizationInvites/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrganizationInvitesAPI();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch organization invites"
      );
    }
  }
);


export const createOrganizationInvite = createAsyncThunk<
  OrganizationInvite,
  CreateInviteDTO,
  { rejectValue: string }
>(
  "organizationInvites/create",
  async (invite, { rejectWithValue }) => {
    try {
      return await createOrganizationInviteAPI(invite);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to create organization invite"
      );
    }
  }
);


export const acceptOrganizationInvite = createAsyncThunk<
  OrganizationMember,
  AcceptInviteDTO,
  { rejectValue: string }
>(
  "organizationInvites/accept",
  async (invite, { rejectWithValue }) => {
    try {
      return await acceptOrganizationInviteAPI(invite);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to accept organization invite"
      );
    }
  }
);


export const revokeOrganizationInvite = createAsyncThunk<
  OrganizationInvite,
  string,
  { rejectValue: string }
>(
  "organizationInvites/revoke",
  async (id, { rejectWithValue }) => {
    try {
      return await revokeOrganizationInviteAPI(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to revoke organization invite"
      );
    }
  }
);


const organizationInviteSlice = createSlice({
  name: "organizationInvites",
  initialState,
  reducers: {
    clearInviteError: (state) => {
      state.error = null;
    },

    clearInvites: (state) => {
      state.invites = [];
    },
  },

  extraReducers: (builder) => {
    builder

      
      .addCase(fetchOrgInvites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOrgInvites.fulfilled, (state, action) => {
        state.loading = false;
        state.invites = action.payload;
      })

      .addCase(fetchOrgInvites.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch invites";
      })


     
      .addCase(createOrganizationInvite.pending, (state) => {
        state.creating = true;
        state.error = null;
      })

      .addCase(createOrganizationInvite.fulfilled, (state, action) => {
        state.creating = false;

        state.invites.unshift(action.payload);
      })

      .addCase(createOrganizationInvite.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload ?? "Failed to create invite";
      })


      .addCase(acceptOrganizationInvite.pending, (state) => {
        state.accepting = true;
        state.error = null;
      })

      .addCase(acceptOrganizationInvite.fulfilled, (state) => {
        state.accepting = false;
      })

      .addCase(acceptOrganizationInvite.rejected, (state, action) => {
        state.accepting = false;
        state.error =
          action.payload ?? "Failed to accept invite";
      })


      
      .addCase(revokeOrganizationInvite.pending, (state) => {
        state.revoking = true;
        state.error = null;
      })

      .addCase(revokeOrganizationInvite.fulfilled, (state, action) => {
        state.revoking = false;

        const index = state.invites.findIndex(
          (invite) => invite.id === action.payload.id
        );

        if (index !== -1) {
          state.invites[index] = action.payload;
        }
      })

      .addCase(revokeOrganizationInvite.rejected, (state, action) => {
        state.revoking = false;
        state.error =
          action.payload ?? "Failed to revoke invite";
      });
  },
});


export const {
  clearInviteError,
  clearInvites,
} = organizationInviteSlice.actions;


export default organizationInviteSlice.reducer;