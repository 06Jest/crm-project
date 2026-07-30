import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  AddNote,
  NotesState,
  UpdateNote,
} from "../types/notes";

import {
  addNoteAPI,
  updateNoteAPI,
  deletePrivateNoteAPI,
  deleteNoteAPI,
  fetchNotesAPI,
  pinNoteAPI,
} from "../services/notesServices";

const initialState: NotesState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchNotes = createAsyncThunk(
  "notes/show-notes",
  async (_, thunkAPI) => {
    try {
      return await fetchNotesAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch notes"
      );
    }
  }
);

export const addNote = createAsyncThunk(
  "notes/add-note",
  async (note: AddNote, thunkAPI) => {
    try {
      return await addNoteAPI(note);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/update-note",
  async (
    {
      id,
      note,
    }: {
      id: string;
      note: UpdateNote;
    },
    thunkAPI
  ) => {
    try {
      return await updateNoteAPI(id, note);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const pinNote = createAsyncThunk(
  "notes/pin-note",
  async (
    {
      id,
      pinned,
    }: {
      id: string;
      pinned: boolean;
    },
    thunkAPI
  ) => {
    try {
      return await pinNoteAPI(id, pinned);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const deletePrivateNote = createAsyncThunk(
  "notes/delete-private-note",
  async (id: string, thunkAPI) => {
    try {
      return await deletePrivateNoteAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/delete-note",
  async (id: string, thunkAPI) => {
    try {
      return await deleteNoteAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchNotes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchNotes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addNote.pending, (state) => {
      state.error = null;
    });

    builder.addCase(addNote.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });

    builder.addCase(addNote.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    builder.addCase(updateNote.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateNote.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (n) => n.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
        state.loading = false;
      }
    });

    builder.addCase(updateNote.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(pinNote.pending, (state) => {
      state.error = null;
      state.loading = true;
    });

    builder.addCase(pinNote.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (n) => n.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
        state.loading = false;
      }
    });

    builder.addCase(pinNote.rejected, (state, action) => {
      state.error = action.payload as string;
    });


    builder.addCase(deletePrivateNote.pending, (state) => {
      state.error = null;
      state.loading = true;
    });

    builder.addCase(deletePrivateNote.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (n) => n.id !== action.payload
      );
      state.loading = false;
    });

    builder.addCase(deletePrivateNote.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });

    builder.addCase(deleteNote.pending, (state) => {
      state.error = null;
      state.loading = true;
    });

    builder.addCase(deleteNote.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (n) => n.id !== action.payload
      );
      state.loading = false;
    });

    builder.addCase(deleteNote.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
    
  },
});

export const { clearError } = notesSlice.actions;

export default notesSlice.reducer;