import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  sendAIChatAPI,
  sendPublicAIChatAPI,
  confirmAIActionAPI,
  getAIConversationsAPI,
  getAIConversationAPI,
} from "../services/aiService";

import type {
  AIChatResponse,
  AIAgentId,
  SendAIChatRequest,
  AIState,
  ConfirmAIActionResponse,
  AIConversation,
  AIConversationWithMessages,
  SendPublicAIChatRequest,
} from "../types/ai";

const initialState: AIState = {
  mode: "authenticated",
  messages: [],
  conversationId: null,
  conversations: [],
  agentId: null,
  loading: false,
  conversationsLoading: false,
  conversationLoading: false,
  error: null,
  confirmation: null,
  sources: [],
  citations: [],
  quota: null,
};

export const sendAIChat = createAsyncThunk<
  AIChatResponse,
  SendAIChatRequest,
  { rejectValue: string }
>(
  "ai/send-chat",
  async (request, thunkAPI) => {
    try {
      const response = await sendAIChatAPI(request);

      return response;
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Failed to send AI message");
    }
  }
);

export const sendPublicAIChat = createAsyncThunk<
  AIChatResponse,
  SendPublicAIChatRequest,
  { rejectValue: string }
>(
  "ai/sendPublicAIChat",
  async (request, { rejectWithValue }) => {
    try {
      return await sendPublicAIChatAPI(request);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to send public AI message"
      );
    }
  }
);

export const confirmAIAction = createAsyncThunk<
  ConfirmAIActionResponse,
  string,
  { rejectValue: string }
>(
  "ai/confirm-action",
  async (confirmationId, thunkAPI) => {
    try {
      return await confirmAIActionAPI(confirmationId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to confirm AI action"
      );
    }
  }
);

export const loadAIConversations = createAsyncThunk<
  AIConversation[],
  void,
  { rejectValue: string }
>(
  "ai/load-conversations",
  async (_, thunkAPI) => {
    try {
      return await getAIConversationsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to load AI conversations"
      );
    }
  }
);

export const loadAIConversation = createAsyncThunk<
  AIConversationWithMessages,
  string,
  { rejectValue: string }
>(
  "ai/load-conversation",
  async (conversationId, thunkAPI) => {
    try {
      return await getAIConversationAPI(conversationId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to load AI conversation"
      );
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,

  reducers: {
    setMode: (
      state,
      action: PayloadAction<"authenticated" | "public">
    ) => {
      state.mode = action.payload;
      state.messages = [];
      state.conversationId = null;
      state.confirmation = null;
      state.sources = [];
      state.citations = [];
      state.quota = null;
      state.error = null;
      state.agentId = null;
    },

    setAgentId: (state, action: PayloadAction<AIAgentId>) => {
      state.agentId = action.payload;
    },

    clearConversation: (state) => {
      state.messages = [];
      state.conversationId = null;
      state.confirmation = null;
      state.sources = [];
      state.citations = [];
      state.error = null;
    },

    clearAIError: (state) => {
      state.error = null;
    },

    clearConfirmation: (state) => {
      state.confirmation = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(sendAIChat.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.mode = "authenticated";
      state.agentId = action.meta.arg.agentId;

      state.messages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: action.meta.arg.message,
      });
    });

    builder.addCase(sendAIChat.fulfilled, (state, action) => {
      const response = action.payload;

      state.loading = false;
      state.error = null;

      if (response.conversationId) {
        state.conversationId = response.conversationId;
      }

      state.messages.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
      });

      state.confirmation = response.confirmation ?? null;
      state.sources = response.sources ?? [];
      state.citations = response.citations ?? [];
      state.quota = response.quota ?? state.quota;
    });
    
    builder.addCase(sendAIChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Failed to send AI message";
    });

    builder.addCase(sendPublicAIChat.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      state.confirmation = null;

      state.messages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: action.meta.arg.message,
      });
    });

    builder.addCase(sendPublicAIChat.fulfilled, (state, action) => {
      const response = action.payload;

      state.loading = false;
      state.error = null;

      if (response.conversationId) {
        state.conversationId = response.conversationId;
      }

      state.messages.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
      });

      state.confirmation = response.confirmation ?? null;
      state.sources = response.sources ?? [];
      state.citations = response.citations ?? [];
      state.quota = response.quota ?? state.quota;
    });

    builder.addCase(sendPublicAIChat.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload ?? "Failed to send public AI message";
    });
    

   builder.addCase(confirmAIAction.pending, (state) => {
      state.error = null;
    });

    builder.addCase(confirmAIAction.fulfilled, (state, action) => {
      const response = action.payload;

      state.confirmation = null;

      state.messages.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.success
          ? "The action was executed successfully."
          : "The action could not be completed.",
      });
    });

    builder.addCase(confirmAIAction.rejected, (state, action) => {
      state.error =
        action.payload ?? "Failed to confirm AI action";
    });

    builder.addCase(loadAIConversations.pending, (state) => {
      state.conversationsLoading = true;
      state.error = null;
    });

    builder.addCase(
      loadAIConversations.fulfilled,
      (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload;
      }
    );

    builder.addCase(
      loadAIConversations.rejected,
      (state, action) => {
        state.conversationsLoading = false;
        state.error =
          action.payload ?? "Failed to load AI conversations";
      }
    );

    builder.addCase(loadAIConversation.pending, (state) => {
      state.conversationLoading = true;
      state.error = null;
    });

    builder.addCase(
      loadAIConversation.fulfilled,
      (state, action) => {
        const { conversation, messages } = action.payload;

        state.conversationLoading = false;
        state.conversationId = conversation.id;
        state.agentId = conversation.agent_id;
        state.messages = messages;
        state.confirmation = null;
        state.sources = [];
        state.citations = [];
      }
    );

    builder.addCase(
      loadAIConversation.rejected,
      (state, action) => {
        state.conversationLoading = false;
        state.error =
          action.payload ?? "Failed to load AI conversation";
      }
    );
  },
});

export const {
  setMode,
  setAgentId,
  clearConversation,
  clearAIError,
  clearConfirmation,
} = aiSlice.actions;

export default aiSlice.reducer;