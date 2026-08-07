export interface EmailState {
  items: EmailListItem[],
  loading: boolean,
  loaded: boolean,
  error: string | null;
};

export const EMAIL_STATUSES = [
  "draft",
  "queued",
  "sent",
  "failed",
] as const;

export type EmailStatus = typeof EMAIL_STATUSES[number];

export const EMAIL_PROVIDERS = [
  "resend",
] as const;

export type EmailProvider = typeof EMAIL_PROVIDERS[number];

export const EMAIL_OWNER_TYPES = [
  "lead",
  "contact",
  "customer",
] as const;

export type EmailOwnerType = typeof EMAIL_OWNER_TYPES[number];

export interface Email {
  id: string;
  org_id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  lead_id: string | null;
  contact_id: string | null;
  customer_id: string | null;
  recipient_email: string;
  subject: string;
  body_html: string;
  body_text: string;
  preview_text: string;
  status: EmailStatus;
  provider: EmailProvider;
  provider_message_id: string | null;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ComposeEmail {
  lead_id?: string;
  contact_id?: string;
  customer_id?: string;
  recipient_email: string;
  subject: string;
  body_text: string;
}

export interface UpdateDraftEmail {
  recipient_email: string;
  subject: string;
  body_text: string;
}

export interface EmailListItem extends Email {
  sender: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    }
  };

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

  organization: {
    id: string;
    name: string;
  };
}

export interface EmailFilters {
  status?: EmailStatus;
  search?: string;
  sender_id?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  email: Email;
}