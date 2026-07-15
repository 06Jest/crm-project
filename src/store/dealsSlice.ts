import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddDeal, DealsState, DealStage, UpdateDeal } from "../types/deal"
import {
  fetchDealsAPI,
  addDealAPI,
  updateDealAPI,
  closeDealAPI,
  deleteDealAPI,
} from '../services/dealService';


const initialState: DealsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchDeals = createAsyncThunk(
  'deals/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await fetchDealsAPI();
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
  'deals/add',
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
  'deals/update',
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

export const closeDeal = createAsyncThunk(
  'deals/close',
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
  'deals/delete',
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
          const deal = state.items.find((l) => l.id === action.payload.id);
          if (deal) deal.stage = action.payload.newStage;
        }, 
  },


  extraReducers: (builder) => {
    builder.addCase(fetchDeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDeals.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchDeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })



    builder.addCase(addDeal.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(addDeal.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    


    builder.addCase(updateDeal.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
    });

    builder.addCase(updateDeal.rejected, (state, action) => {
      state.error = action.payload as string
    });

    builder.addCase(closeDeal.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
    });

    builder.addCase(closeDeal.rejected, (state, action) => {
      state.error = action.payload as string
    });



    builder.addCase(deleteDeal.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    });

    builder.addCase(deleteDeal.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },

});

export const { moveDealLocally } = dealSlice.actions;
export default dealSlice.reducer;

