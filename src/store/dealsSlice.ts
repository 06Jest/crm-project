import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Deal } from  '../types/deal';
import {
  fetchDealsFromDB,
  addDealToDB,
  updateDealInDB,
  deleteDealFromDB,
} from '../services/dealService';

interface DealsState {
  items: Deal[];
  loading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchDeals = createAsyncThunk(
  'deals/fetchAll',
  async (_, { rejectWithValue}) => {
    try {
      return await fetchDealsFromDB();
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const addDeal = createAsyncThunk(
  'deals/add',
  async (deal: Omit<Deal, 'id' | 'created_at'>, { rejectWithValue }) => {
    try {
      return await addDealToDB(deal);
    } catch (err: unknown ) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong')
    }
  }
);

export const updateDeal = createAsyncThunk(
  'deals/update',
  async (deal: Deal, { rejectWithValue}) => {
    try {
      return await updateDealInDB(deal);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const deleteDeal = createAsyncThunk(
  'deals/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteDealFromDB(id);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    

    builder.addCase(fetchDeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDeals.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchDeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    
    builder.addCase(addDeal.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
    builder.addCase(addDeal.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    
    builder.addCase(updateDeal.fulfilled, (state, action) => {
      const index = state.items.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    });
    builder.addCase(updateDeal.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    
    builder.addCase(deleteDeal.fulfilled, (state, action) => {
      state.items = state.items.filter((d) => d.id !== action.payload);
    });
    builder.addCase(deleteDeal.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default dealsSlice.reducer;