import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddContact, ContactsState, UpdateContact } from "../types/contact"
import {
  fetchContactsAPI,
  addContactAPI,
  addContactFromLeadsAPI,
  updateContactAPI,
  deleteContactAPI,
} from '../services/contactService';


const initialState: ContactsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await fetchContactsAPI();
    }  catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      };
       return thunkAPI
          .rejectWithValue(
            'Failed to fetch contacts'
          );  
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/add',
  async (
      contact: AddContact, thunkAPI) => {
    try {
      return await addContactAPI(contact);
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

export const addContactFromLeads = createAsyncThunk(
  'contacts/move',
  async (
      contact: AddContact, thunkAPI) => {
    try {
      return await addContactFromLeadsAPI(contact);
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

export const updateContact = createAsyncThunk(
  'contacts/update',
  async ({id, contact}:{
      id: string;
      contact: UpdateContact
    },thunkAPI) => {
    try {
      return await updateContactAPI( id, contact);
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

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id: string, thunkAPI) => {
    try {
      return await deleteContactAPI(id);
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



const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
     clearError(state) {
      state.error = null;
    },
  },


  extraReducers: (builder) => {
    builder.addCase(fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })


    builder.addCase(addContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addContact.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });

    builder.addCase(addContact.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });


    builder.addCase(addContactFromLeads.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addContactFromLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
    });

    builder.addCase(addContactFromLeads.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });


    builder.addCase(updateContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateContact.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContact.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(deleteContact.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
      state.loading = false;
    });

    builder.addCase(deleteContact.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },

});
export const {  clearError } = contactsSlice.actions;
export default contactsSlice.reducer;

