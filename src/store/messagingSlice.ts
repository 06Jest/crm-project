import { createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';
import type { Message } from '../types/message';
import type { Profile } from '../types/profile';
import {
  fetchProfilesFromDB,
  fetchConversationFromDB,
  sendMessageToDB,
  markMessagesReadInDB,
  fetchUnreadCountsFromDB,
} from '../services/messagingService';

interface MessagingState {
  profiles: Profile[];
  conversations: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MessagingState = {
  profiles: [],
  conversations: {},
  unreadCounts: {},
  activeConversationId: null,
  loading: false,
  error: null, 
};

export const fetchProfiles = createAsyncThunk(
  'messaging/fetchProfiles',
  async(_, { rejectWithValue }) => {
    try{
      return await fetchProfilesFromDB();
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong')
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'messaging/fetchConversation',
  async (
    { currentUserId, otherUserId }: { currentUserId: string; otherUserId: string}, { rejectWithValue}
  ) => {
    try {
      const messages = await fetchConversationFromDB(currentUserId, otherUserId);
      return {otherUserId, messages};
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messaging/sendMessage',
  async (
    message:Omit<Message, 'id' | 'created_at' | 'is_read' | 'sender' | 'receiver'>, 
    { rejectWithValue }
  ) => {
    try {
      return await sendMessageToDB(message);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const markMessagesRead = createAsyncThunk(
  'messagin/markRead',
  async (
    { senderId, receiverId }: { senderId: string; receiverId: string },
    { rejectWithValue }
  ) => {
    try {
      await markMessagesReadInDB(senderId, receiverId);
      return { senderId };
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

export const fetchUnreadCounts = createAsyncThunk(
  'messaging/fetchUnread',
  async(currentUserId: string, { rejectWithValue }) => {
    try {
      return await fetchUnreadCountsFromDB(currentUserId);
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Something went wrong');
    }
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const msg = action.payload;
      const otherId = msg.sender_id; 
      if (!state.conversations[otherId]) {
        state.conversations[otherId] = [];
       }
      state.conversations[otherId].push(msg);

      if (state.activeConversationId !== otherId) {
        state.unreadCounts[otherId] = (state.unreadCounts[otherId] || 0) + 1;
      }
    },

    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
  },

  extraReducers: (builder) => {


    builder.addCase(fetchProfiles.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });


    builder.addCase(fetchConversation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchConversation.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations[action.payload.otherUserId] = action.payload.messages;
    });
    builder.addCase(fetchConversation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });


    builder.addCase(sendMessage.fulfilled, (state, action) => {
      const msg = action.payload;
      const otherId = msg.receiver_id;
      if (!state.conversations[otherId]) {
        state.conversations[otherId] = [];
      }
      state.conversations[otherId].push(msg);
    });


    builder.addCase(markMessagesRead.fulfilled, (state, action) => {
      delete state.unreadCounts[action.payload.senderId];
    });


    builder.addCase(fetchUnreadCounts.fulfilled, (state, action) => {
      state.unreadCounts = action.payload;
    });
  },
});

export const { receiveMessage, setActiveConversation } = messagingSlice.actions;
export default messagingSlice.reducer;


