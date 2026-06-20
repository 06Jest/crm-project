import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Lead, LeadsStatus } from "../types/lead"
import { supabase  } from "../services/supabase";
import {
  fetchLeadsAPI,
  addLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
} from '../services/leadService';



interface LeadsState {
  items: Lead[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (token: string, thunkAPI) => {
    try {
      return await fetchLeadsAPI(token);
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
  'leads/add',
  async (
      lead: Omit<
        Lead,
        'id' |
        'created_at' |
        'owner_id' |
        'org_id' |
        'owner_name' 
      >, thunkAPI) => {
    try {

      const {data: { session }} = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No token found');
      }

      return await addLeadAPI(token, lead);
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
  'leads/update',
  async ({id, lead}:{
      id: string;
      lead: 
      Omit<
        Lead,
        'id' |
        'created_at' |
        'owner_id' |
        'org_id' |
        'owner_name'
    >;},thunkAPI) => {
    try {

      const {data: { session }} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No token found');
      }
      return await updateLeadAPI(token, id, lead);
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
  'leads/delete',
  async (id: string, thunkAPI) => {
    try {

      const {data: { session }} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No token found');
      }
      return await deleteLeadAPI(token, id);
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
      action: { payload: { id: string; newStatus: LeadsStatus}}
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

    builder.addCase(fetchLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchLeads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })



    builder.addCase(addLead.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(addLead.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    


    builder.addCase(updateLead.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
    });

    builder.addCase(updateLead.rejected, (state, action) => {
      state.error = action.payload as string
    });



    builder.addCase(deleteLead.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    });

    builder.addCase(deleteLead.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },

});

export const { moveLeadLocally } = leadSlice.actions;
export default leadSlice.reducer;

