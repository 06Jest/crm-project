import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddContact, ContactCareer, ContactSocials, ContactsState, UpdateContact } from "../types/contact"
import {
  addContactAPI,
  addContactFromLeadsAPI,
  updateContactAPI,
  deleteContactAPI,
  deleteBulkContactsAPI,
  updateSocialsAPI,
  updateCareerAPI,
  fetchContactsListsAPI,
} from '../services/contactService';


const initialState: ContactsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchContactsLists = createAsyncThunk(
  'contacts/show-contacts-lists',
  async (_, thunkAPI) => {
    try {
      return await fetchContactsListsAPI();
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
  'contacts/add-contact',
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
  'contacts/update-contact',
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

export const updateSocials = createAsyncThunk(
  'contacts/update-socials',
  async ({id, socials}:{
      id: string;
      socials: ContactSocials
    },thunkAPI) => {
    try {
      return await updateSocialsAPI( id, socials);
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

export const updateCareer = createAsyncThunk(
  'contacts/update-career',
  async ({id, career}:{
      id: string;
      career: ContactCareer
    },thunkAPI) => {
    try {
      return await updateCareerAPI( id, career);
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
  'contacts/delete-contact',
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

export const deleteBulkContacts = createAsyncThunk(
  'contacts/delete-contacts',
  async (ids: string[], thunkAPI) => {
    try {
      return await deleteBulkContactsAPI(ids);
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
    builder.addCase(fetchContactsLists.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchContactsLists.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchContactsLists.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })


    builder.addCase(addContact.pending, (state) => {
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



    builder.addCase(updateSocials.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateSocials.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateSocials.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateCareer.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateCareer.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateCareer.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(deleteContact.pending, (state) => {
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



    builder.addCase(deleteBulkContacts.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteBulkContacts.fulfilled, (state, action) => {
      state.items = state.items.filter(
        contact => !action.payload.includes(contact.id));
      state.loading = false;
    });

    builder.addCase(deleteBulkContacts.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },

});
export const {  clearError } = contactsSlice.actions;
export default contactsSlice.reducer;

