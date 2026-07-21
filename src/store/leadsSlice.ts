import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type  { AddLead, LeadsState, LeadStatus,UpdateLead } from "../types/lead"
import {
  addLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
  updateLeadStatusAPI,
  fetchLeadsListsAPI,
} from '../services/leadService';


const initialState: LeadsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};


export const fetchLeadsLists = createAsyncThunk(
  'leads/show-leads-lists',
  async (_, thunkAPI) => {
    try {
      return await fetchLeadsListsAPI();
    }  catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      };
       return thunkAPI
          .rejectWithValue(
            'Failed to fetch leads'
          );  
    }
  }
);

export const addLead = createAsyncThunk(
  'leads/add-lead',
  async (
      lead: AddLead, 
      thunkAPI) => {
    try {
      return await addLeadAPI(lead);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI
        .rejectWithValue(
          'Something went wrong'
        );
    }
  }
);


export const updateLead = createAsyncThunk(
  'leads/update-lead',
  async ({id, lead}:{
      id: string;
      lead: UpdateLead
    },thunkAPI) => {
    try {
      return await updateLeadAPI( id, lead);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI
        .rejectWithValue(
          'Something went wrong'
        );
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  'leads/update-lead-status',
  async ({ id, status }:{ id: string, status: LeadStatus}
    ,thunkAPI) => {
    try {
      return await updateLeadStatusAPI( id, status);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI
        .rejectWithValue(
          'Something went wrong'
        );
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete-lead',
  async (id: string, thunkAPI) => {
    try {
      return await deleteLeadAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI
        .rejectWithValue(
          'Something went wrong'
        );
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    moveLeadLocally: (
      state,
      action: { payload: { id: string; newStatus: LeadStatus}}
    ) => {
      const lead = state.items.find((l) => l.id === action.payload.id);
      if (lead) lead.status = action.payload.newStatus;
    },
    clearError(state) {
      state.error = null;
    },
  },


  extraReducers: (builder) => {
    
    builder.addCase(fetchLeadsLists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchLeadsLists.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchLeadsLists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })


    builder.addCase(addLead.pending, (state) => {
      state.error = null;
    });

    builder.addCase(addLead.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });

    builder.addCase(addLead.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
    

    builder.addCase(updateLead.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLead.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLead.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateLeadStatus.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadStatus.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadStatus.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });


    builder.addCase(deleteLead.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteLead.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(c => c.id !== action.payload);
    });

    builder.addCase(deleteLead.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },

});

export const { moveLeadLocally, clearError } = leadSlice.actions;
export default leadSlice.reducer;

