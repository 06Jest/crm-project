import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  AddTask,
  TasksState,
  UpdateTask,
  TaskPriority,
  TaskStatus,
} from "../types/tasks";

import {
  fetchTasksAPI,
  addTaskAPI,
  updateTaskAPI,
  assignTaskAPI,
  completeTaskAPI,
  updateTaskPriorityAPI,
  updateTaskDueDateAPI,
  deleteTaskAPI,
  fetchTaskByIDAPI,
  fetchTasksByStatusAPI,
  fetchTasksByPriorityAPI,
  fetchTasksByAssigneeAPI,
  fetchDueTodayTasksAPI,
  fetchOverdueTasksAPI,
} from "../services/tasksService";

const initialState: TasksState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/show-tasks",
  async (_, thunkAPI) => {
    try {
      return await fetchTasksAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Failed to fetch tasks");
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/add-task",
  async (task: AddTask, thunkAPI) => {
    try {
      return await addTaskAPI(task);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update-task",
  async (
    {
      id,
      task,
    }: {
      id: string;
      task: UpdateTask;
    },
    thunkAPI
  ) => {
    try {
      return await updateTaskAPI(id, task);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const assignTask = createAsyncThunk(
  "tasks/assign-task",
  async (
    {
      id,
      assigned_to,
    }: {
      id: string;
      assigned_to: string;
    },
    thunkAPI
  ) => {
    try {
      return await assignTaskAPI(id, assigned_to);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const completeTask = createAsyncThunk(
  "tasks/complete-task",
  async (
    {
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    },
    thunkAPI
  ) => {
    try {
      return await completeTaskAPI(id, completed);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const updateTaskPriority = createAsyncThunk(
  "tasks/update-task-priority",
  async (
    {
      id,
      priority,
    }: {
      id: string;
      priority: TaskPriority;
    },
    thunkAPI
  ) => {
    try {
      return await updateTaskPriorityAPI(id, priority);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const updateTaskDueDate = createAsyncThunk(
  "tasks/update-task-due-date",
  async (
    {
      id,
      due_date,
    }: {
      id: string;
      due_date: string | null;
    },
    thunkAPI
  ) => {
    try {
      return await updateTaskDueDateAPI(id, due_date);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete-task",
  async (id: string, thunkAPI) => {
    try {
      return await deleteTaskAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const fetchTaskByID = createAsyncThunk(
  "tasks/show-task",
  async (id: string, thunkAPI) => {
    try {
      return await fetchTaskByIDAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch task"
      );
    }
  }
);

export const fetchTasksByStatus = createAsyncThunk(
  "tasks/show-tasks-by-status",
  async (status: TaskStatus, thunkAPI) => {
    try {
      return await fetchTasksByStatusAPI(status);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch tasks"
      );
    }
  }
);

export const fetchTasksByPriority = createAsyncThunk(
  "tasks/show-tasks-by-priority",
  async (priority: TaskPriority, thunkAPI) => {
    try {
      return await fetchTasksByPriorityAPI(priority);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch tasks"
      );
    }
  }
);

export const fetchTasksByAssignee = createAsyncThunk(
  "tasks/show-tasks-by-assignee",
  async (assignedTo: string, thunkAPI) => {
    try {
      return await fetchTasksByAssigneeAPI(assignedTo);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch tasks"
      );
    }
  }
);

export const fetchDueTodayTasks = createAsyncThunk(
  "tasks/show-due-today-tasks",
  async (_, thunkAPI) => {
    try {
      return await fetchDueTodayTasksAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch tasks"
      );
    }
  }
);

export const fetchOverdueTasks = createAsyncThunk(
  "tasks/show-overdue-tasks",
  async (_, thunkAPI) => {
    try {
      return await fetchOverdueTasksAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch tasks"
      );
    }
  }
);


const tasksSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(addTask.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
      state.loading = false;
    });

    builder.addCase(addTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(updateTask.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(assignTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(assignTask.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(assignTask.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(completeTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(completeTask.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(completeTask.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(updateTaskPriority.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateTaskPriority.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(updateTaskPriority.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(updateTaskDueDate.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateTaskDueDate.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(updateTaskDueDate.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(deleteTask.pending, (state) => {
      state.error = null;
      state.loading = true;
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (t) => t.id !== action.payload
      );

      state.loading = false;
    });

    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchTaskByID.pending, (state) => {
  state.loading = true;
  state.error = null;
});

builder.addCase(fetchTaskByID.fulfilled, (state, action) => {
  state.loading = false;

  const index = state.items.findIndex(
    (t) => t.id === action.payload.id
  );

  if (index !== -1) {
    state.items[index] = action.payload;
  } else {
    state.items.push(action.payload);
  }
});

  builder.addCase(fetchTaskByID.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  builder.addCase(fetchTasksByStatus.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchTasksByStatus.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
  });

  builder.addCase(fetchTasksByStatus.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  builder.addCase(fetchTasksByPriority.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchTasksByPriority.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
  });

  builder.addCase(fetchTasksByPriority.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  builder.addCase(fetchTasksByAssignee.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchTasksByAssignee.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
  });

  builder.addCase(fetchTasksByAssignee.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  builder.addCase(fetchDueTodayTasks.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchDueTodayTasks.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
  });

  builder.addCase(fetchDueTodayTasks.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  builder.addCase(fetchOverdueTasks.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchOverdueTasks.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
  });

  builder.addCase(fetchOverdueTasks.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
  },
});

export const { clearError } = tasksSlice.actions;

export default tasksSlice.reducer;