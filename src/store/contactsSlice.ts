import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Contact } from "../types/contact"
import { supabase  } from "../services/supabase";
import {
  fetchContactsAPI,
  addContactAPI,
  updateContactAPI,
  deleteContactAPI,
} from '../services/contactService';



interface ContactsState {
  items: Contact[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (token: string, thunkAPI) => {
    try {
      return await fetchContactsAPI(token);
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
      contact: Omit<
        Contact,
        'id' |
        'created_at' |
        'owner_id' |
        'org_id' |
        'owner_name' |
        'full_name'
      >, thunkAPI) => {
    try {

      const {data: { session }} = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error('No token found');
      }

      return await addContactAPI(token, contact);
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
  async ({id, contact,}:{
      id: string;
      contact: Omit<
        Contact,
        'id' |
        'created_at' |
        'owner_id' |
        'org_id' |
        'owner_name' |
        'full_name'
    >;},thunkAPI) => {
    try {

      const {data: { session }} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No token found');
      }
      return await updateContactAPI(token, id, contact);
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

      const {data: { session }} = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No token found');
      }
      return await deleteContactAPI(token, id);
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
  reducers: {},


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

