export interface TasksState {
  items: TaskListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const TASK_TARGET_TYPES = [
  "lead",
  "contact",
  "deal",
  "customer",
  "personal",
] as const;

export type TaskTargetType = typeof TASK_TARGET_TYPES[number];

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type TaskStatus = typeof TASK_STATUSES[number];

export const TASK_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export type TaskPriority = typeof TASK_PRIORITIES[number];

export const TASK_VISIBILITIES = [
  "public",
  "private",
] as const;

export type TaskVisibility = typeof TASK_VISIBILITIES[number];

export const TASK_TYPES = [
  "call",
  "email",
  "sms",
  "meeting",
  "other",
] as const;

export type TaskType = typeof TASK_TYPES[number];

export interface Task {
  id: string;
  org_id: string;
  title: string;
  description: string;
  task_type: TaskType;
  target_type: TaskTargetType;
  target_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  visibility: TaskVisibility;
  author_id: string;
  assigned_to?: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string |null;
}

export interface AddTask {
  title: string;
  description: string;
  task_type: TaskType;
  target_type: TaskTargetType;
  target_id: string | null;
  priority?: TaskPriority;
  visibility?: TaskVisibility;
  assigned_to?: string | null;
  due_date?: string | null;
}


export interface UpdateTask {
  title: string;
  description: string;
  task_type: TaskType;
  target_type: TaskTargetType;
  target_id: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  visibility?: TaskVisibility;
  assigned_to?: string | null;
  due_date?: string | null;
}

export interface TaskListItem extends Task {
  author: {
    id: string;
    first_name: string;
    last_name: string;
  };

  assignee: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

