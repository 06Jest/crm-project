import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  InputAdornment,
  Divider,
  Tooltip,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlagIcon from '@mui/icons-material/Flag';

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  notes: string;
  dueDate: string; // yyyy-mm-dd, empty = no due date
  priority: Priority;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

type ViewMode = 'list' | 'editor';
type FilterMode = 'active' | 'completed' | 'all';

const priorityColor: Record<Priority, string> = {
  low: '#8a8a8a',
  medium: '#e0a300',
  high: '#e0453c',
};

export default function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('active');
  const [view, setView] = useState<ViewMode>('list');
  const [activeId, setActiveId] = useState<string | null>(null); // null = new task

  const [draftTitle, setDraftTitle] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftDueDate, setDraftDueDate] = useState('');
  const [draftPriority, setDraftPriority] = useState<Priority>('medium');

  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return b.updatedAt - a.updatedAt;
      });
  }, [tasks, query, filter]);

  const openNewTask = () => {
    setActiveId(null);
    setDraftTitle('');
    setDraftNotes('');
    setDraftDueDate('');
    setDraftPriority('medium');
    setView('editor');
  };

  const openExistingTask = (task: Task) => {
    setActiveId(task.id);
    setDraftTitle(task.title);
    setDraftNotes(task.notes);
    setDraftDueDate(task.dueDate);
    setDraftPriority(task.priority);
    setView('editor');
  };

  const removeTask = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) {
      setView('list');
      setActiveId(null);
    }
  };

  const toggleComplete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      )
    );
  };

  const saveAndExit = () => {
    const title = draftTitle.trim();

    if (!title) {
      if (activeId) removeTask(activeId);
      setView('list');
      setActiveId(null);
      return;
    }

    if (activeId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId
            ? {
                ...t,
                title,
                notes: draftNotes,
                dueDate: draftDueDate,
                priority: draftPriority,
                updatedAt: Date.now(),
              }
            : t
        )
      );
    } else {
      const now = Date.now();
      setTasks((prev) => [
        {
          id: crypto.randomUUID(),
          title,
          notes: draftNotes,
          dueDate: draftDueDate,
          priority: draftPriority,
          completed: false,
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);
    }

    setView('list');
    setActiveId(null);
  };

  const formatDue = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);

    if (diffDays === 0) return { label: 'Today', overdue: false };
    if (diffDays < 0) return { label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), overdue: true };
    if (diffDays === 1) return { label: 'Tomorrow', overdue: false };
    return { label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), overdue: false };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* LIST VIEW */}
      {view === 'list' && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="New task">
              <IconButton color="primary" onClick={openNewTask}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* filter tabs */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            {(['active', 'completed', 'all'] as FilterMode[]).map((f) => (
              <Box
                key={f}
                onClick={() => setFilter(f)}
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 4,
                  fontSize: '0.7rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  bgcolor: filter === f ? 'primary.main' : 'action.hover',
                  color: filter === f ? 'primary.contrastText' : 'inherit',
                }}
              >
                {f}
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {visibleTasks.length === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', mt: 4 }}>
                {tasks.length === 0 ? 'No tasks yet' : 'Nothing here'}
              </Typography>
            ) : (
              <List dense disablePadding>
                {visibleTasks.map((task) => {
                  const due = formatDue(task.dueDate);
                  return (
                    <ListItem
                      key={task.id}
                      disableGutters
                      onClick={() => openExistingTask(task)}
                      sx={{
                        alignItems: 'flex-start',
                        borderBottom: '1px solid',
                        borderColor: '#63636322',
                        py: 0.5,
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      secondaryAction={
                        <IconButton edge="end" size="small" onClick={(e) => removeTask(task.id, e)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <Checkbox
                        checked={task.completed}
                        onClick={(e) => toggleComplete(task.id, e)}
                        size="small"
                        sx={{ p: 0.5, mt: 0.25 }}
                      />
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                            <FlagIcon sx={{ fontSize: 12, color: priorityColor[task.priority] }} />
                            {due && (
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  fontSize: '0.7rem',
                                  color: due.overdue && !task.completed ? '#e0453c' : 'inherit',
                                  opacity: due.overdue && !task.completed ? 1 : 0.6,
                                }}
                              >
                                {due.label}
                              </Typography>
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{
                          fontSize: '0.85rem',
                          sx: {
                            pr: 3,
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.5 : 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          },
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        </>
      )}

      {/* EDITOR VIEW - used for both new tasks and editing existing ones */}
      {view === 'editor' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton size="small" onClick={saveAndExit}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.6, flex: 1 }}>
              {activeTask ? new Date(activeTask.createdAt).toLocaleString() : 'New task'}
            </Typography>
            {activeTask && (
              <IconButton size="small" onClick={(e) => removeTask(activeTask.id, e)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Divider sx={{ mb: 1 }} />

          <TextField
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            variant="standard"
            placeholder="Task title"
            InputProps={{ disableUnderline: true }}
            sx={{ mb: 1, '& input': { fontSize: '0.95rem', fontWeight: 600 } }}
          />

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              type="date"
              size="small"
              label="Due date"
              value={draftDueDate}
              onChange={(e) => setDraftDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <Select
              size="small"
              value={draftPriority}
              onChange={(e: SelectChangeEvent) => setDraftPriority(e.target.value as Priority)}
              sx={{ flex: 1 }}
            >
              <MenuItem value="low">
                <FlagIcon sx={{ fontSize: 14, color: priorityColor.low, mr: 0.5, verticalAlign: 'middle' }} />
                Low
              </MenuItem>
              <MenuItem value="medium">
                <FlagIcon sx={{ fontSize: 14, color: priorityColor.medium, mr: 0.5, verticalAlign: 'middle' }} />
                Medium
              </MenuItem>
              <MenuItem value="high">
                <FlagIcon sx={{ fontSize: 14, color: priorityColor.high, mr: 0.5, verticalAlign: 'middle' }} />
                High
              </MenuItem>
            </Select>
          </Box>

          <Divider sx={{ mb: 1 }} />

          <TextField
            value={draftNotes}
            onChange={(e) => setDraftNotes(e.target.value)}
            multiline
            variant="standard"
            InputProps={{ disableUnderline: true }}
            placeholder="Add details..."
            sx={{
              flex: 1,
              overflowY: 'auto',
              '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' },
              '& textarea': { height: '100% !important', overflowY: 'auto !important' },
            }}
          />
        </Box>
      )}
    </Box>
  );
}