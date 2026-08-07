export interface SmsState {
  items: SmsListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const SMS_STATUSES = [
  "queued",
  "sending",
  "sent",
  "delivered",
  "failed",
] as const;

export type SmsStatus = (typeof SMS_STATUSES)[number];

export interface Sms {
  id: string;
  org_id: string;
  lead_id: string | null;
  contact_id: string | null;
  sender_id: string;
  content: string;
  status: SmsStatus;
  created_at: string;
  updated_at: string;
}

export interface SmsListItem extends Sms {
  contact?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  } | null;

  lead?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  } | null;

  sender: {
    id: string;
    profile: {
      first_name: string,
      last_name: string,
      avatar_url: string | null,
    }
  };
}

export interface CreateSms {
  lead_id?: string;
  contact_id?: string;
  content: string;
}

export interface CreateSmsInput {
  lead_id: string;
  contact_id: string;
  content: string;
}

export interface UpdateSmsStatus {
  status: SmsStatus;
}

export interface SmsFilters {
  status?: SmsStatus;
  search?: string;
}