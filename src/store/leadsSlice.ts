import { createSlice,  createAsyncThunk } from "@reduxjs/toolkit";
import type { Lead } from '../types/lead';
import {
  fetchLeadsFromDB,
  addLeadToDB,
  updateLeadInDB,
  deleteLeadFromDB,
}from '../services/leadService';

interface LeadState {
  items: Lead[];
  loading: boolean;
  error: string | null;
};

const initialState: LeadState = {
  items: [],
  loading: false,
  error: null
}

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchLeadsFromDB();
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const addLead = createAsyncThunk(
  'leads/add',
  async (lead: Omit<Lead, 'id' | 'created_at'>, { rejectWithValue }) => {
    try {
      return await addLeadToDB(lead);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async (lead: Lead, { rejectWithValue }) => {
    try {
      return await updateLeadInDB(lead);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id: string, {rejectWithValue}) => {
    try {
      return await deleteLeadFromDB(id);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers:{
    
    moveLeadLocally: (
      state,
      action: { payload: { id: string; newStatus: Lead['status']}}
    ) => {
      const lead = state.items.find((l) => l.id === action.payload.id);
      if (lead) lead.status = action.payload.newStatus;
    }, 
  },

  extraReducers: (builder) => {
  
    builder.addCase(fetchLeads.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchLeads.fulfilled, (state,action) => {
      state.loading = false;
      state.items = action.payload;
    })

    builder.addCase(fetchLeads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });



    builder.addCase(addLead.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(addLead.rejected, (state, action) => {
      state.error = action.payload as string;
    });



    builder.addCase(updateLead.fulfilled, (state, action)=> {
      const index = state.items.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    });

    builder.addCase(updateLead.rejected, (state, action) =>{
      state.error = action.payload as string;
    });



    builder.addCase(deleteLead.fulfilled, (state, action)=> {
      state.items = state.items.filter((l) => l.id !== action.payload);
    });

    builder.addCase(deleteLead.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { moveLeadLocally } = leadSlice.actions;
export default leadSlice.reducer;