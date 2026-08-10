import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  ConversationListItem,
  ConversationsState,
} from "../types/chat";

import {
  fetchConversationsAPI,
  fetchDirectConversationAPI,
  createDirectConversationAPI,
  markConversationAsReadAPI,
} from '../services/chatService';

const initialState: ConversationsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  "chat/conversations",
  async (_, thunkAPI) => {
    try {
      return await fetchConversationsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch conversations"
      );
    }
  }
);

export const fetchDirectConversation = createAsyncThunk(
  "chat/direct-conversation",
  async (userId: string, thunkAPI) => {
    try {
      return await fetchDirectConversationAPI(userId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch direct conversation"
      );
    }
  }
);

export const createDirectConversation = createAsyncThunk(
  "chat/create-direct-conversation",
  async (profileId: string, thunkAPI) => {
    try {
      return await createDirectConversationAPI(profileId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to create direct conversation"
      );
    }
  }
);


export const markConversationAsRead = createAsyncThunk(
  "chat/mark-conversation-read",
  async (conversationId: string, thunkAPI) => {
    try {
      const result = await markConversationAsReadAPI(conversationId);

      return {
        conversationId,
        readAt: result.last_read_at,
      };
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to mark conversation as read"
      );
    }
  }
);


const conversationsSlice = createSlice({
  name: "conversations",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    clearConversations(state) {
      state.items = [];
      state.loaded = false;
    },

    addRealtimeConversation(state, action) {
      const exists = state.items.some(
        c => c.id === action.payload.id
      );

      if (!exists) {
        state.items.unshift(action.payload);
      }
    },

    updateRealtimeConversation(state, action) {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index === -1) return;

      const current = state.items[index];
      const patch = { ...action.payload };

      if (
        patch.last_read_at &&
        current.last_read_at &&
        new Date(patch.last_read_at).getTime() < new Date(current.last_read_at).getTime()
      ) {
        delete patch.last_read_at; 
      }

      state.items[index] = { ...current, ...patch };
    },

    removeRealtimeConversation(state, action) {
      state.items = state.items.filter(
        c => c.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    

    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchDirectConversation.pending, (state) => {
      state.error = null;
    });

    builder.addCase(fetchDirectConversation.fulfilled, (state, action) => {
      const conversation = action.payload;

      if (!conversation) return;

      const exists = state.items.some(
        (item) => item.id === conversation.id
      );

      if (!exists) {
        state.items.unshift(conversation as ConversationListItem);
      }
    });

    builder.addCase(fetchDirectConversation.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(createDirectConversation.pending, (state) => {
      state.error = null;
    });

    builder.addCase(createDirectConversation.fulfilled, (state, action) => {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.unshift(action.payload as ConversationListItem);
      }
    });

    builder.addCase(createDirectConversation.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(markConversationAsRead.pending, (state) => {
      state.error = null;
    });

    builder.addCase(markConversationAsRead.fulfilled, (state, action) => {
      const { conversationId, readAt } = action.payload;
      const index = state.items.findIndex((c) => c.id === conversationId);
      if (index !== -1) {
        const current = state.items[index].last_read_at;
        if (!current || new Date(readAt).getTime() > new Date(current).getTime()) {
          state.items[index] = { ...state.items[index], last_read_at: readAt };
        }
      }
    });

    builder.addCase(markConversationAsRead.rejected, (state, action) => {
      state.error = action.payload as string;
    });
      },
    });

export const {
  clearError,
  clearConversations,
  addRealtimeConversation,
  updateRealtimeConversation,
  removeRealtimeConversation,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;