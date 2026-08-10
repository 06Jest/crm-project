export interface ActivitiesState {
  items: ActivityListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const ACTIVITY_TYPES = [
  "meeting",
  "visit",
  "follow_up",
  "other",
  "lead",
  "contact",
  "deal",
  "customer",
  "task",
  "call",
  "note",
  "sms",
  "email",
  "system"
] as const;

export type ActivityType =
  (typeof ACTIVITY_TYPES)[number];

export const MANUAL_ACTIVITY_TYPES = [
  "meeting",
  "visit",
  "follow_up",
  "other",
] as const;

export type ManualActivityType =
  (typeof MANUAL_ACTIVITY_TYPES)[number];

export const ACTIVITY_ACTIONS = [
  "created",
  "updated",
  "deleted",
  "assigned",
  "started",
  "completed",
  "cancelled",
  "sent",
] as const;

export type ActivityAction =
  (typeof ACTIVITY_ACTIONS)[number];

export const MANUAL_ACTIVITY_ACTIONS = [
  "created",
  "completed",
  "cancelled",
] as const;

export type ManualActivityAction =
  (typeof MANUAL_ACTIVITY_ACTIONS)[number];

export interface Activity {
  id: string;
  org_id: string;
  lead_id?: string | null;
  contact_id?: string | null;
  customer_id?: string | null;
  target_name: string | null;
  created_by: string;
  assigned_to?: string;
  type: ActivityType;
  action: ActivityAction;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityListItem extends Activity {
  creator: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    }
  };

  lead?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;

  contact?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;

  customer?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;

  assignee: {
    id: string;
    profile: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    }
  };
}

export interface CreateActivity {
  lead_id?: string | null;
  contact_id?: string | null;
  customer_id?: string | null;
  target_name: string | null;
  assigned_to?: string;
  type: ActivityType;
  action: ActivityAction;
  title: string;
  description?: string;
}

export interface ManualCreateActivity {
  lead_id?: string;
  contact_id?: string;
  customer_id?: string;
  type: ManualActivityType;
  action: ManualActivityAction;
  title: string;
  description?: string;
}

export interface UpdateActivity {
  title?: string;
  description?: string;
}

export interface ActivityFilters {
  type?: ActivityType;
  action?: ActivityAction;
  search?: string;
}
