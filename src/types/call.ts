export interface CallsState {
  items: CallListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const CALL_STATUSES = [
  "scheduled",
  "dialing",
  "ringing",
  "active",
  "completed",
  "cancelled",
] as const;

export type CallStatus = typeof CALL_STATUSES[number];

export const CALL_TYPES = [
  "sales",
  "follow_up",
  "support",
  "demo",
  "onboarding",
  "renewal",
  "other",
] as const;

export type CallType = typeof CALL_TYPES[number];

export const CALL_OUTCOMES = [
  "interested",
  "not_interested",
  "callback_requested",
  "resolved",
  "other",
] as const;

export type CallOutcome = typeof CALL_OUTCOMES[number];

export const CALL_PRIORITIES = [
  "low",
  "medium",
  "high",
] as const;

export type CallPriority = typeof CALL_PRIORITIES[number];

export interface Call {
  id: string;
  org_id: string;
  lead_id: string | null;
  contact_id: string | null;
  created_by: string;
  assigned_to: string;
  subject: string;
  notes: string | null;
  type: CallType;
  status: CallStatus;
  outcome: CallOutcome | null;
  priority: CallPriority;
  scheduled_for: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCall {
  lead_id: string | null;
  contact_id?: string | null;
  assigned_to?: string | null;
  subject: string;
  notes?: string;
  type: CallType;
  priority?: CallPriority;
  scheduled_for?: string | null;
}

export interface UpdateCall {
  subject?: string;
  notes?: string;
  type?: CallType;
  priority?: CallPriority;
  scheduled_for?: string;
}

export interface EndCall {
  notes?: string;
  outcome: CallOutcome;
}

export interface CallListItem extends Call {
  assigned_user: {
    id: string;
    first_name: string;
    last_name: string;
  };

  creator: {
    id: string;
    first_name: string;
    last_name: string;
  };

  lead?: {
    id: string;
    first_name: string;
    last_name: string;
  };

  contact?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface CallFilters {
  status?: CallStatus;
  type?: CallType;
  priority?: CallPriority;
  assigned_to?: string;
  search?: string;
}

export interface CreateCallInput {
  subject: string;
  type: CallType;
  priority?: CallPriority;
  notes?: string;
  lead_id?: string | null;
  contact_id?: string | null;
  assigned_to?: string;
  scheduled_for?: string;
}


export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}