import type { Profile } from "./profile";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  contact_id?: string;
  contact_name?: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}