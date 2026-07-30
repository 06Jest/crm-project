
export interface ConversationsState {
  items: ConversationListItem[],
  loading: boolean,
  loaded: boolean,
  error: string | null
}

export interface MessagesState {
  items: MessageListItem[],
  loading: boolean,
  loaded: boolean,
  sending: boolean,
  error: string | null
}
export const CONVERSATION_TYPES = [
  "announcement",
  "organization",
  "direct",
] as const;

export type ConversationType = typeof CONVERSATION_TYPES[number];

export const CHAT_TARGET_TYPES = [
  "lead",
  "contact",
  "deal",
  "customer",
] as const;

export type ChatTargetType = typeof CHAT_TARGET_TYPES[number];

export interface ChatTarget {
  entity_type: ChatTargetType;
  entity_id: string;
}


export interface Conversation {
  id: string;
  org_id: string;
  type: ConversationType;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_id: string;
  deleted_at: string | null;
}

export interface ConversationWithLastMessage extends Conversation {

  last_message: {
    id: string,
    sender_id: string,
    content: string,
    created_at: string
  } | null;

}

export interface ConversationListItem extends ConversationWithLastMessage {

  other_participant?: {
    id: string,
    avatar_url: string | null,
    display_name: string,
  },
  my_last_read_at: string  | null
}

export interface UserConversationData {
  conversations: ConversationWithLastMessage[];
  members: MemberData[];
}

export interface MemberData {
   conversation_id: string,

   member: {
    id: string,
    avatar_url: string | null,
    display_name: string
   }[]
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  profile_id: string;
  joined_at: string;
  last_read_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  entity_type: ChatTargetType | null;
  entity_id: string | null;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  deleted_at: string | null;
}

export interface MessageListItem extends Message {
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null,
  };
}

export interface CreateConversation {
  type: ConversationType;
  member_ids: string[];
}


export interface AddMessage {
  content: string;
  entity_type?: ChatTargetType | null;
  entity_id?: string | null;
}



export interface ConversationMemberListItem
  extends ConversationMember {

  profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null,
  };
}

