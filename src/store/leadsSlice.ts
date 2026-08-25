import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type  { AddLead, LeadCareer, LeadPersonal, LeadSocials, LeadsState, LeadStatus } from "../types/lead"
import {
  addLeadAPI,
  updateLeadPersonalAPI,
  deleteLeadAPI,
  updateLeadStatusAPI,
  fetchLeadsListsAPI,
  updateLeadCareerAPI,
  updateLeadSocialsAPI,
  updateLeadNotesAPI,
  updateLeadSourceAPI,
  updateLeadPriorityAPI,
  updateLeadPreferredTimeAPI,
  fetchLeadListByIDAPI,
} from '../services/leadService';
import type { PreferredTime, Priority, Source } from "../types/global";


const initialState: LeadsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};


export const fetchLeadsLists = createAsyncThunk(
  'leads/show-lists',
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

export const fetchLeadListByID = createAsyncThunk(
  'leads/show-by-id',
  async (id: string, thunkAPI) => {
    try {
      return await fetchLeadListByIDAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue('Failed to fetch lead');
    }
  }
);

export const addLead = createAsyncThunk(
  'leads/add',
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


export const updateLeadPersonal = createAsyncThunk(
  'leads/update/personal',
  async ({id, personal}:{
      id: string;
      personal: LeadPersonal
    },thunkAPI) => {
    try {
      return await updateLeadPersonalAPI( id, personal);
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

export const updateLeadCareer = createAsyncThunk(
  'leads/update/career',
  async ({id, career}:{
      id: string;
      career: LeadCareer
    },thunkAPI) => {
    try {
      return await updateLeadCareerAPI( id, career);
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

export const updateLeadSocials = createAsyncThunk(
  'leads/update/socials',
  async ({id, socials}:{
      id: string;
      socials: LeadSocials
    },thunkAPI) => {
    try {
      return await updateLeadSocialsAPI( id, socials);
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
  'leads/update/status',
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

export const updateLeadNotes = createAsyncThunk(
  'leads/update/notes',
  async ({ id, notes }:{ id: string, notes: string}
    ,thunkAPI) => {
    try {
      return await updateLeadNotesAPI( id, notes);
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

export const updateLeadSource = createAsyncThunk(
  'leads/update/source',
  async ({ id, source }:{ id: string, source: Source}
    ,thunkAPI) => {
    try {
      return await updateLeadSourceAPI( id, source);
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

export const updateLeadPriority = createAsyncThunk(
  'leads/update/priority',
  async ({ id, priority }:{ id: string, priority: Priority}
    ,thunkAPI) => {
    try {
      return await updateLeadPriorityAPI( id, priority);
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

export const updateLeadPreferredTime = createAsyncThunk(
  'leads/update/preferred-time',
  async ({ id, preferredTime }:{ id: string, preferredTime: PreferredTime}
    ,thunkAPI) => {
    try {
      return await updateLeadPreferredTimeAPI( id, preferredTime);
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
      state.loaded = false;
    })


    builder.addCase(fetchLeadListByID.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchLeadListByID.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.items.findIndex(
        (lead) => lead.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(fetchLeadListByID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

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
    

    builder.addCase(updateLeadPersonal.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadPersonal.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadPersonal.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });

    builder.addCase(updateLeadSocials.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadSocials.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadSocials.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });

    builder.addCase(updateLeadCareer.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadCareer.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadCareer.rejected, (state, action) => {
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

    
    builder.addCase(updateLeadNotes.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadNotes.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadNotes.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });


    builder.addCase(updateLeadSource.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadSource.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadSource.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });


    builder.addCase(updateLeadPriority.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadPriority.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadPriority.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });


    builder.addCase(updateLeadPreferredTime.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateLeadPreferredTime.fulfilled, (state, action) => {
      const index = state.items.findIndex(l => l.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateLeadPreferredTime.rejected, (state, action) => {
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

