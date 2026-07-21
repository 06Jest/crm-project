import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddDeal, DealsState, DealStage, UpdateDeal } from "../types/deal"
import {
  addDealAPI,
  updateDealAPI,
  closeDealAPI,
  deleteDealAPI,
  updateDealStageAPI,
  fetchDealsListsAPI,
} from '../services/dealService';


const initialState: DealsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchDealsLists = createAsyncThunk(
  'deals/show-deals-lists',
  async (_, thunkAPI) => {
    try {
      return await fetchDealsListsAPI();
    }  catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      };
       return thunkAPI
          .rejectWithValue(
            'Failed to fetch deals'
          );  
    }
  }
);

export const addDeal = createAsyncThunk(
  'deals/add-deal',
  async (
      deal: AddDeal, thunkAPI) => {
    try {
      return await addDealAPI(deal);
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


export const updateDeal = createAsyncThunk(
  'deals/update-deal',
  async ({id, deal}:{
      id: string;
      deal: UpdateDeal},thunkAPI) => {
    try {

      return await updateDealAPI(id, deal);
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

export const updateDealStage = createAsyncThunk(
  'leads/update-deal-stage',
  async ({ id, stage }:{ id: string, stage: DealStage}
    ,thunkAPI) => {
    try {
      return await updateDealStageAPI( id, stage);
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

export const closeDeal = createAsyncThunk(
  'deals/close-deal',
  async ({id, stage}:{
      id: string;
      stage: DealStage},thunkAPI) => {
    try {
      return await closeDealAPI( id, stage);
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

export const deleteDeal = createAsyncThunk(
  'deals/delete-deal',
  async (id: string, thunkAPI) => {
    try {
      return await deleteDealAPI( id );
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



const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    moveDealLocally: (
      state,
      action: { payload: { id: string; newStage: DealStage}}
    ) => {
      const deal = state.items.find((d) => d.id === action.payload.id);
      if (deal) deal.stage = action.payload.newStage;
    },
    clearError(state) {
      state.error = null;
    },
  },


  extraReducers: (builder) => {
    builder.addCase(fetchDealsLists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDealsLists.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchDealsLists.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    })


    builder.addCase(addDeal.pending, (state) => {
      state.error = null;
    });

    builder.addCase(addDeal.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });

    builder.addCase(addDeal.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
    


    builder.addCase(updateDeal.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateDeal.fulfilled, (state, action) => {
      console.log("PAYLOAD:", action.payload);
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateDeal.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateDealStage.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateDealStage.fulfilled, (state, action) => {
      const index = state.items.findIndex(d => d.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateDealStage.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });


    builder.addCase(closeDeal.pending, (state) => {
      state.error = null;
    });

    builder.addCase(closeDeal.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(closeDeal.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });


    builder.addCase(deleteDeal.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteDeal.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
      state.loading = false;
    });

    builder.addCase(deleteDeal.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },

});

export const { moveDealLocally, clearError } = dealSlice.actions;
export default dealSlice.reducer;

