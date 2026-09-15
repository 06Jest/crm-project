// export interface AIState {
//   mode: "authenticated" | "public";
//   agentId: AIAgentId | null;
//   messages: AIChatMessage[];
//   conversationId: string | null;
//   loading: boolean;
//   error: string | null;
//   confirmation: AIConfirmation | null;
//   sources: AIResponseSource[];
//   citations: AICitation[];
//   quota: AIQuota | null;
// }

export interface AIState {
  mode: "authenticated" | "public";
  agentId: AIAgentId | null;
  messages: AIChatMessage[];
  conversationId: string | null;
  conversations: AIConversation[];
  loading: boolean;
  conversationsLoading: boolean;
  error: string | null;
  confirmation: AIConfirmation | null;
  sources: AIResponseSource[];
  citations: AICitation[];
  quota: AIQuota | null;
}



export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type AIAgentId =
  | "personal-assistant"
  | "organization-assistant"
  | "crm-assistant";


export interface SendAIChatRequest {
  agentId: AIAgentId;
  message: string;
  conversationId?: string;
}

export interface SendPublicAIChatRequest {
  message: string;
}

export interface AIResponseSource {
  sourceId: string;
  sourceType: string;
  title?: string;
  chunkIndex: number;
  similarity?: number;
}

export interface AICitation {
  sourceIndex: number;
  sourceId: string;
  sourceType: string;
  title?: string;
  chunkIndex: number;
  similarity?: number;
}

export interface AIConfirmation {
  required: true;
  confirmationId: string;
  toolCall: {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
    thoughtSignature?: string;
  };
}

export interface AIQuota {
  promptsUsed: number;
  promptsRemaining: number;
  limit: number;
  windowExpiresAt: string;
}

export interface AIChatResponse {
  message: string;
  conversationId?: string;
  sources?: AIResponseSource[];
  citations?: AICitation[];
  confirmation?: AIConfirmation;
  quota?: AIQuota;
}

export interface ConfirmAIActionResponse {
  success: boolean;
  result: unknown;
}
export interface AIConversation {
  id: string;
  profile_id: string;
  org_id: string | null;
  agent_id: AIAgentId;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIConversationWithMessages {
  conversation: AIConversation;
  messages: AIChatMessage[];
}