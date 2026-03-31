import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Contact } from "../types/contact"
import {
  fetchContactsFromDB,
  addContactToDB,
  updateContactInDB,
  deleteContactFromDB,
} from '../services/contactService';

interface ContactsState {
  items: Contact[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchContactsFromDB();
    }  catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/add',
  async (contact: Omit<Contact, 'id'>, { rejectWithValue }) => {
    try {
      return await addContactToDB(contact);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/update',
  async (contact: Contact, { rejectWithValue }) => {
    try {
      return await updateContactInDB(contact);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id:string, { rejectWithValue }) => {
    try {
      return await deleteContactFromDB(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},


  extraReducers: (builder) => {
    builder.addCase(fetchContacts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });

    builder.addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })



    builder.addCase(addContact.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(addContact.rejected, (state, action) => {
      state.error = action.payload as string;
    });



    builder.addCase(updateContact.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
    });

    builder.addCase(updateContact.rejected, (state, action) => {
      state.error = action.payload as string
    });



    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    });

    builder.addCase(deleteContact.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },

});

export default contactsSlice.reducer;

