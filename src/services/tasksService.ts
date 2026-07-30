import type {
  AddTask,
  TaskListItem,
  TaskPriority,
  TaskStatus,
  UpdateTask,
} from '../types/tasks';

import { apiClient } from "./apiClient";

export const fetchTasksAPI = async (): Promise<TaskListItem[]> => {
  const result = await apiClient("/api/tasks/show-tasks", {
    method: "GET",
  });

  return result.data as TaskListItem[];
};

export const fetchTaskByIDAPI = async (
  id: string
): Promise<TaskListItem> => {
  const result = await apiClient(`/api/tasks/show-task/${id}`, {
    method: "GET",
  });

  return result.data as TaskListItem;
};

export const addTaskAPI = async (
  task: AddTask
): Promise<TaskListItem> => {
  const result = await apiClient("/api/tasks/add-task", {
    method: "POST",
    body: JSON.stringify(task),
  });

  return result.data as TaskListItem;
};

export const updateTaskAPI = async (
  id: string,
  task: UpdateTask
): Promise<TaskListItem> => {
  const result = await apiClient(`/api/tasks/update-task/${id}`, {
    method: "PATCH",
    body: JSON.stringify(task),
  });

  return result.data as TaskListItem;
};

export const assignTaskAPI = async (
  id: string,
  assigned_to: string
): Promise<TaskListItem> => {
  const result = await apiClient(`/api/tasks/assign-task/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ assigned_to }),
  });

  return result.data as TaskListItem;
};

export const completeTaskAPI = async (
  id: string,
  completed: boolean
): Promise<TaskListItem> => {
  const result = await apiClient(`/api/tasks/complete-task/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });

  return result.data as TaskListItem;
};

export const updateTaskPriorityAPI = async (
  id: string,
  priority: TaskPriority
): Promise<TaskListItem> => {
  const result = await apiClient(
    `/api/tasks/update-task-priority/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ priority }),
    }
  );

  return result.data as TaskListItem;
};

export const updateTaskDueDateAPI = async (
  id: string,
  due_date: string | null
): Promise<TaskListItem> => {
  const result = await apiClient(
    `/api/tasks/update-task-due-date/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ due_date }),
    }
  );

  return result.data as TaskListItem;
};

export const fetchTasksByStatusAPI = async (
  status: TaskStatus
): Promise<TaskListItem[]> => {
  const result = await apiClient(
    `/api/tasks/show-tasks/status/${status}`,
    {
      method: "GET",
    }
  );

  return result.data as TaskListItem[];
};

export const fetchTasksByPriorityAPI = async (
  priority: TaskPriority
): Promise<TaskListItem[]> => {
  const result = await apiClient(
    `/api/tasks/show-tasks/priority/${priority}`,
    {
      method: "GET",
    }
  );

  return result.data as TaskListItem[];
};

export const fetchTasksByAssigneeAPI = async (
  assignedTo: string
): Promise<TaskListItem[]> => {
  const result = await apiClient(
    `/api/tasks/show-tasks/assignee/${assignedTo}`,
    {
      method: "GET",
    }
  );

  return result.data as TaskListItem[];
};

export const fetchDueTodayTasksAPI = async (): Promise<TaskListItem[]> => {
  const result = await apiClient(
    "/api/tasks/show-due-today-tasks",
    {
      method: "GET",
    }
  );

  return result.data as TaskListItem[];
};

export const fetchOverdueTasksAPI = async (): Promise<TaskListItem[]> => {
  const result = await apiClient(
    "/api/tasks/show-overdue-tasks",
    {
      method: "GET",
    }
  );

  return result.data as TaskListItem[];
};

export const deleteTaskAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/tasks/delete-task/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};

