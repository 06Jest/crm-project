import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  AddMessage,
  MessagesState,
} from "../types/chat";

import {
  fetchMessagesAPI,
  sendMessageAPI,
  editMessageAPI,
  deleteMessageAPI,
} from "../services/chatService";

const initialState: MessagesState = {
  items: [],
  loading: false,
  loaded: false,
  sending: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "chat/messages",
  async (conversationId: string, thunkAPI) => {
    try {
      return await fetchMessagesAPI(conversationId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/send-message",
  async (
    {
      conversationId,
      message,
    }: {
      conversationId: string;
      message: AddMessage;
    },
    thunkAPI
  ) => {
    try {
      return await sendMessageAPI(
        conversationId,
        message
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to send message"
      );
    }
  }
);

export const editMessage = createAsyncThunk(
  "chat/edit-message",
  async (
    {
      id,
      content,
    }: {
      id: string;
      content: string;
    },
    thunkAPI
  ) => {
    try {
      return await editMessageAPI(
        id,
        content
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to edit message"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/delete-message",
  async (id: string, thunkAPI) => {
    try {
      return await deleteMessageAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to delete message"
      );
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    clearMessages(state) {
      state.items = [];
      state.loaded = false;
      state.loading = false;
      state.error = null;
    },

    addRealtimeMessage(state, action) {
      const exists = state.items.some(
        (m) => m.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    updateRealtimeMessage(state, action) {
      const index = state.items.findIndex(
        (m) => m.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },

    removeRealtimeMessage(state, action) {
      state.items = state.items.filter(
        (m) => m.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {

    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(sendMessage.pending, (state) => {
      state.sending = true;
      state.error = null;
    });

    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sending = false;
      const exists = state.items.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    });;

    builder.addCase(sendMessage.rejected, (state, action) => {
      state.sending = false;
      state.error = action.payload as string;
    });

    builder.addCase(editMessage.pending, (state) => {
      state.error = null;
    });

    builder.addCase(editMessage.fulfilled, (state, action) => {

      const index = state.items.findIndex(
        (message) => message.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

    });

    builder.addCase(editMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(deleteMessage.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (message) => message.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
        };
      }
    });

    builder.addCase(deleteMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  clearError,
  clearMessages,
  addRealtimeMessage,
  updateRealtimeMessage,
  removeRealtimeMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;