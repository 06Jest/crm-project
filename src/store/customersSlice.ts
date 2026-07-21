import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CustomerState, CustomerStatus } from "../types/customer";
import { deleteBulkCustomersAPI, deleteCustomerAPI, fetchCustomersListsAPI, updateCustomerNotesAPI, updateCustomerStatusAPI } from "../services/customerService";


const initialState: CustomerState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchCustomersLists = createAsyncThunk(
  'customers/show-customers-lists',
  async (_, thunkAPI) => {
    try {
      return await fetchCustomersListsAPI();
    }  catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      };
       return thunkAPI
          .rejectWithValue(
            'Failed to fetch customers'
          );  
    }
  }
);

export const updateCustomerNotes = createAsyncThunk(
  'customers/update-customer-notes',
  async ({id, notes}:{
      id: string;
      notes: string
    },thunkAPI) => {
    try {
      return await updateCustomerNotesAPI( id, notes);
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

export const updateCustomerStatus = createAsyncThunk(
  'customers/update-customer-status',
  async ({id, status}:{
      id: string;
      status: CustomerStatus
    },thunkAPI) => {
    try {
      return await updateCustomerStatusAPI( id, status);
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


export const deleteCustomer = createAsyncThunk(
  'customers/delete-customer',
  async (id: string, thunkAPI) => {
    try {
      return await deleteCustomerAPI(id);
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

export const deleteBulkCustomers = createAsyncThunk(
  'customers/delete-customers',
  async (ids: string[], thunkAPI) => {
    try {
      return await deleteBulkCustomersAPI(ids);
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



const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
     clearError(state) {
      state.error = null;
    },
  },


  extraReducers: (builder) => {
    builder.addCase(fetchCustomersLists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchCustomersLists.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchCustomersLists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })



    builder.addCase(updateCustomerNotes.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateCustomerNotes.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateCustomerNotes.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateCustomerStatus.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateCustomerStatus.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateCustomerStatus.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(deleteCustomer.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
      state.loading = false;
    });

    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });



    builder.addCase(deleteBulkCustomers.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteBulkCustomers.fulfilled, (state, action) => {
      state.items = state.items.filter(
        customer => !action.payload.includes(customer.id));
      state.loading = false;
    });

    builder.addCase(deleteBulkCustomers.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },

});
export const {  clearError } = customersSlice.actions;
export default customersSlice.reducer;

