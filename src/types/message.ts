import type { Profile } from "./profile";

export type MentionType =
  | 'contact'
  | 'customer'
  | 'lead'
  | 'deal';

export interface MentionItem {
  type: MentionType;
  id: string;
  name: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  contact_id?: string;
  contact_name?: string;
  mentions?: MentionItem[];   
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface MentionSuggestion {
  type: MentionType;
  id: string;
  name: string;
  subtitle?: string;
  icon?: string;
}