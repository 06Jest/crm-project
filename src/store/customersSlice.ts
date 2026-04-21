import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Customer } from '../types//customer';
import {
  fetchCustomersFromDB,
  addCustomerToDB,
  updateCustomerInDB,
  deleteCustomerFromDB,
} from '../services/customerService';

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customer/fetchAll',
  async(_, { rejectWithValue }) => {
    try {
      return await fetchCustomersFromDB();
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);


export const addCustomer = createAsyncThunk(
  'customers/add',
  async (
    customer: Omit<Customer, 'id' | 'created_at'>,
    { rejectWithValue }
  ) => {
    try {
      return await addCustomerToDB(customer);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customer/update',
  async (customer: Customer, { rejectWithValue }) => {
    try {
      return await updateCustomerInDB(customer);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customer/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteCustomerFromDB(id);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });
    builder.addCase(addCustomer.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    });
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default customersSlice.reducer;

