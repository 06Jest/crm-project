import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AddContact, ContactCareer, ContactPersonal, ContactSocials, ContactsState } from "../types/contact"
import {
  addContactAPI,
  addContactFromLeadsAPI,
  deleteContactAPI,
  deleteBulkContactsAPI,
  fetchContactsListsAPI,
  updateContactPersonalAPI,
  updateContactSocialsAPI,
  updateContactCareerAPI,
  updateContactNotesAPI,
  updateContactSourceAPI,
  updateContactPriorityAPI,
  updateContactPreferredTimeAPI,
  fetchContactListByIDAPI,
} from '../services/contactService';
import type { PreferredTime, Priority, Source } from "../types/global";


const initialState: ContactsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchContactsLists = createAsyncThunk(
  'contacts/show-lists',
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

export const fetchContactListByID = createAsyncThunk(
  'contacts/view-list',
  async (id: string, thunkAPI) => {
    try {
      return await fetchContactListByIDAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        'Failed to fetch contact'
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

export const updateContactPersonal = createAsyncThunk(
  'contacts/update/personal',
  async ({id, personal}:{
      id: string;
      personal: ContactPersonal
    },thunkAPI) => {
    try {
      return await updateContactPersonalAPI( id, personal);
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

export const updateContactSocials = createAsyncThunk(
  'contacts/update/socials',
  async ({id, socials}:{
      id: string;
      socials: ContactSocials
    },thunkAPI) => {
    try {
      return await updateContactSocialsAPI( id, socials);
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

export const updateContactCareer = createAsyncThunk(
  'contacts/update/career',
  async ({id, career}:{
      id: string;
      career: ContactCareer
    },thunkAPI) => {
    try {
      return await updateContactCareerAPI( id, career);
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

export const updateContactNotes = createAsyncThunk(
  'contacts/update/notes',
  async ({ id, notes }:{ id: string, notes: string}
    ,thunkAPI) => {
    try {
      return await updateContactNotesAPI( id, notes);
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

export const updateContactSource = createAsyncThunk(
  'contacts/update/source',
  async ({ id, source }:{ id: string, source: Source}
    ,thunkAPI) => {
    try {
      return await updateContactSourceAPI( id, source);
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

export const updateContactPriority = createAsyncThunk(
  'contacts/update/priority',
  async ({ id, priority }:{ id: string, priority: Priority}
    ,thunkAPI) => {
    try {
      return await updateContactPriorityAPI( id, priority);
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

export const updateContactPreferredTime = createAsyncThunk(
  'contacts/update/preferred-time',
  async ({ id, preferredTime }:{ id: string, preferredTime: PreferredTime}
    ,thunkAPI) => {
    try {
      return await updateContactPreferredTimeAPI( id, preferredTime);
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

export const deleteBulkContacts = createAsyncThunk(
  'contacts/delete/bulk',
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
      state.loaded = false;
    })


    builder.addCase(fetchContactListByID.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchContactListByID.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.items.findIndex(
        contact => contact.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(fetchContactListByID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


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


    builder.addCase(updateContactPersonal.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactPersonal.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactPersonal.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateContactSocials.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactSocials.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactSocials.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateContactCareer.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactCareer.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if(index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactCareer.rejected, (state, action) => {
      state.error = action.payload as string
      state.loading = false;
    });



    builder.addCase(updateContactNotes.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactNotes.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactNotes.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });


    builder.addCase(updateContactSource.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactSource.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactSource.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });


    builder.addCase(updateContactPriority.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactPriority.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactPriority.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });


    builder.addCase(updateContactPreferredTime.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateContactPreferredTime.fulfilled, (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      state.loading = false;
    });

    builder.addCase(updateContactPreferredTime.rejected, (state, action) => {
      state.error = action.payload as string;
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

