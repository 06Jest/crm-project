import { useState, useMemo, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  InputAdornment,
  Divider,
  Paper,
  CircularProgress,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FlagIcon from "@mui/icons-material/Flag";
import EventIcon from "@mui/icons-material/Event";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  fetchTasks,
  clearError,
} from "../../store/tasksSlice";
import type {
  TaskListItem,
  TaskTargetType,
  TaskVisibility,
  TaskStatus,
  TaskPriority,
  TaskType,
} from "../../types/tasks";
import ErrorAlert from "../Error";
import { fetchContactsLists } from "../../store/contactsSlice";
import { fetchLeadsLists } from "../../store/leadsSlice";
import { fetchDealsLists } from "../../store/dealsSlice";
import { fetchCustomersLists } from "../../store/customersSlice";
import { formatName, formatShortTitle, formatTitle } from "../../utils/formatText";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchMembersIDNames } from "../../store/ProfileSlice";

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: "#9e9e9e",
  medium: "#2196f3",
  high: "#ed6c02",
  urgent: "#d32f2f",
};

export default function TasksPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items: tasks, loading: tL, loaded: tLd, error } = useSelector(
    (state: RootState) => state.tasks
  );

  const {
    items: members,
    loaded: membersLoaded,
  } = useSelector((state: RootState) => state.profile);

  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loaded: lLd } = useSelector((s: RootState) => s.leads);
  const { items: deals, loaded: dLd } = useSelector((s: RootState) => s.deals);
  const { items: customers, loaded: cuLd } = useSelector((s: RootState) => s.customers);

  const contactsMap = useMemo(
    () => new Map(contacts.map((c) => [c.id, c])),
    [contacts]
  );

  const leadsMap = useMemo(() => new Map(leads.map((l) => [l.id, l])), [leads]);

  const dealsMap = useMemo(() => new Map(deals.map((d) => [d.id, d])), [deals]);

  const customersMap = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers]
  );

  const { user } = useAuth();
  const userId = user?.id;

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "editor">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState<TaskVisibility>("private");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editStatus, setEditStatus] = useState<TaskStatus>("todo");
  const [editDueDate, setEditDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [targetFilter, setTargetFilter] = useState<"all" | TaskTargetType>("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState<"all" | TaskType>("all");
  const [targetType, setTargetType] = useState<TaskTargetType>("personal");
  const [taskType, setTaskType] = useState<TaskType>("other");
  const [targetId, setTargetId] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskListItem | null>();
  const [openDelete, setOpenDelete] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [selectedTaskDone, setSelectedTaskDone] = useState<TaskListItem | null>();
  const [assignedTo, setAssignedTo] = useState(userId);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!tLd) await dispatch(fetchTasks()).unwrap();
        if (!cLd) await dispatch(fetchContactsLists()).unwrap();
        if (!lLd) await dispatch(fetchLeadsLists()).unwrap();
        if (!dLd) await dispatch(fetchDealsLists()).unwrap();
        if (!cuLd) await dispatch(fetchCustomersLists()).unwrap();
        if (!membersLoaded) {
          await dispatch(fetchMembersIDNames()).unwrap();
        }
      } catch {
        // Error handled by Redux state
      }
    };
    loadData();
  },[tLd, cLd, lLd, dLd, cuLd, membersLoaded, dispatch]);

  const refresh = async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch {
      // Error handled by Redux state
    }
  };

  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  const openNewTask = () => {
    setActiveId(null);
    setEditTitle("");
    setEditDescription("");
    setEditVisibility("private");
    setEditPriority("medium");
    setEditStatus("todo");
    setEditDueDate("");
    setTargetType("personal");
    setTaskType("other");
    setTargetId("");
    setView("editor");
    setAssignedTo(userId);
  };

  const openExistingTask = (task: TaskListItem) => {
    setActiveId(task.id);
    handleEditTask(task);
    setView("editor");
    setAssignedTo(task.assigned_to ?? userId);
  };

  const removeTask = async (task: TaskListItem) => {
    const isAuthor = task.author_id === userId;

    if (!isAuthor) {
      return;
    }

    try {
      await dispatch(deleteTask(task.id)).unwrap();
    } catch {
      return;
    }

    if (activeId === task.id) {
      setView("list");
      setActiveId(null);
      setEditTitle("");
      setEditDescription("");
    }
  };

  const handleEditTask = (task: TaskListItem) => {
    setTargetType(task.target_type);
    setTaskType(task.task_type);
    setTargetId(task.target_id ?? "");
    setEditVisibility(task.visibility);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditDueDate(task.due_date ? task.due_date.slice(0, 10) : "");
  };

  const canSave =
    editTitle.trim().length > 0 &&
    (targetType === "personal" || targetId.length > 0);

  const items = useMemo(() => {
    switch (targetType) {
      case "contact":
        return contacts.map((c) => ({
          id: c.id,
          label: `${c.first_name} ${c.last_name}`,
        }));

      case "lead":
        return leads.map((l) => ({
          id: l.id,
          label: `${l.first_name} ${l.last_name}`,
        }));

      case "deal":
        return deals.map((d) => ({
          id: d.id,
          label:
            d.title.length > 25
              ? `${formatTitle(d.title).slice(0, 25)}...`
              : formatTitle(d.title).toUpperCase(),
        }));

      case "customer":
        return customers.map((c) => {
          const con = contacts.find((co) => co.id === c.contact_id);

          return {
            id: c.id,
            label: con
              ? `${con.first_name} ${con.last_name}`
              : "Unknown Contact",
          };
        });
      default:
        return [];
    }
  }, [targetType, contacts, leads, deals, customers]);

  const saveAndExit = async () => {
    const title = editTitle.trim();

    if (!title) {
      setView("list");
      setActiveId(null);
      return;
    }
    if (!userId) {
      return;
    }

    setSaving(true);
    try {
      if (activeId) {
        await dispatch(
          updateTask({
            id: activeId,
            task: {
              title,
              description: editDescription,
              visibility: editVisibility,
              priority: editPriority,
              status: editStatus,
              due_date: editDueDate ? new Date(editDueDate).toISOString() : null,
              target_type: targetType,
              task_type: taskType,
              target_id: targetType === "personal" ? null : targetId,
              assigned_to: assignedTo || userId,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          addTask({
            title,
            description: editDescription,
            visibility: editVisibility,
            priority: editPriority,
            due_date: editDueDate ? new Date(editDueDate).toISOString() : null,
            target_type: targetType,
            task_type: taskType,
            target_id: targetType === "personal" ? null : targetId,
            assigned_to: assignedTo || userId,
          })
        ).unwrap();
      }
      setView("list");
      setActiveId(null);
      setEditTitle("");
      setEditDescription("");
      setEditVisibility("private");
      setEditPriority("medium");
      setEditStatus("todo");
      setEditDueDate("");
      setTargetType("personal");
      setTargetId("");
      setAssignedTo("");
    } catch {
      // error in state
    } finally {
      setSaving(false);
    }
  };

  const getValue = (type: TaskTargetType, id: string | null) => {
    if (!id) return "";

    if (type === "contact") {
      const value = contactsMap.get(id);
      if (!value) return "";
      return formatName(value.first_name, value.last_name);
    }

    if (type === "lead") {
      const value = leadsMap.get(id);
      if (!value) return "";
      return formatName(value.first_name, value.last_name);
    }

    if (type === "deal") {
      const deal = dealsMap.get(id);
      if (!deal) return "";

      const contact = contactsMap.get(deal.contact_id);
      if (!contact) return "";

      return `${formatName(contact.first_name, contact.last_name)} : ${formatShortTitle(deal.title)}`;
    }

    if (type === "customer") {
      const customer = customersMap.get(id);
      if (!customer) return "";

      const contact = contactsMap.get(customer.contact_id);
      if (!contact) return "";

      return formatName(contact.first_name, contact.last_name);
    }
    return "";
  };

  const toggleComplete = async (task: TaskListItem) => {
    try {
      await dispatch(
        completeTask({ id: task.id, completed: task.status !== "completed" })
      ).unwrap();
    } catch {
      // error in state
    }
  };

  const isOverdue = (task: TaskListItem) =>
    !!task.due_date &&
    task.status !== "completed" &&
    task.status !== "cancelled" &&
    new Date(task.due_date).getTime() < Date.now();

  const visibleTasks = useMemo(() => {
    const search = query.trim().replace(/\s+/g, " ").toLowerCase();

    return tasks
      .filter((task) => {
        const due = task.due_date ? new Date(task.due_date) : null;

        const searchableFields = [
          task.title,
          task.description,
          task.target_type,
          task.visibility,
          task.status,
          task.task_type,
          task.priority,
          getValue(task.target_type, task.target_id),
          due ? due.toLocaleDateString("en-US") : "",
          due ? due.toLocaleDateString("en-US", { month: "short" }) : "",
          due ? String(due.getDate()) : "",
        ];

        const matchesSearch =
          !search ||
          searchableFields.some((field) => field.toLowerCase().includes(search));

        const matchesStatus =
          statusFilter === "all" || task.status === statusFilter;

        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        const matchesTaskType =
          taskTypeFilter === "all" || task.task_type === taskTypeFilter;

        const matchesTarget =
          targetFilter === "all" || task.target_type === targetFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesTarget && matchesTaskType;
      })
      .sort((a, b) => {
        const aDone = a.status === "completed" || a.status === "cancelled";
        const bDone = b.status === "completed" || b.status === "cancelled";
        if (aDone !== bDone) return Number(aDone) - Number(bDone);

        if (a.due_date && b.due_date) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date) return -1;
        if (b.due_date) return 1;

        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [tasks, query, statusFilter, priorityFilter, targetFilter, taskTypeFilter]);

  const canEdit =
  !activeTask ||
  (activeTask.author_id === userId &&
    activeTask.status !== "completed");

  const canComplete =
    !activeTask || activeTask?.author_id === userId || activeTask?.assigned_to === userId;

  const handleOpenDelete = (task: TaskListItem) => {
    setSelectedTask(task);
    setOpenDelete(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {view === "list" && (
        <>
          {error && (
            <Box sx={{ width: "100%", my: 1 }}>
              <ErrorAlert message={error} />
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Refresh">
              <span>
                {tL ? (
                  <IconButton size="small" disabled={tL}>
                    <CircularProgress size={15} />
                  </IconButton>
                ) : (
                  <IconButton size="small" onClick={refresh} disabled={tL}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                )}
              </span>
            </Tooltip>
            <TextField
              size="small"
              fullWidth
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Paper title="Add Task" elevation={2} sx={{ borderRadius: 10 }}>
                <IconButton
                  color="primary"
                  onClick={() => {
                    dispatch(clearError());
                    openNewTask();
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Paper>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 0.5 }}>
                <FormControl size="small">
                  <Select
                    title="Filter task type"
                    value={taskTypeFilter}
                    onChange={(e) =>
                      setTaskTypeFilter(e.target.value as "all" | TaskType)
                    }
                    sx={{
                      width: 90,
                      textTransform: 'capitalize',
                      "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="all">All</MenuItem>
                    <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize'}} value="other">other</MenuItem>
                    <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="call">call</MenuItem>
                    <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="sms">sms</MenuItem>
                    <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="email">email</MenuItem>
                    <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="meeting">meeting</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <Select
                    title="Filter status"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as "all" | TaskStatus)
                    }
                    sx={{
                      width: 100,
                      "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="all">All</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="todo">To Do</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="in_progress">In Progress</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="completed">Completed</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    title="Filter priority"
                    value={priorityFilter}
                    onChange={(e) =>
                      setPriorityFilter(e.target.value as "all" | TaskPriority)
                    }
                    sx={{
                      width: 90,
                      "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="all">All</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="low">Low</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="medium">Medium</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="high">High</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    title="Filter target"
                    value={targetFilter}
                    onChange={(e) =>
                      setTargetFilter(e.target.value as "all" | TaskTargetType)
                    }
                    sx={{
                      width: 100,
                      "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="all">All</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="personal">Personal</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="contact">Contacts</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="lead">Leads</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="deal">Deals</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="customer">Customers</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>

          {tL && !tLd ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress size={22} />
            </Box>
          ) : visibleTasks.length === 0 ? (
            <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
              {tasks.length === 0 ? "No tasks yet" : "No matches found"}
            </Typography>
          ) : (
            <List sx={{ overflowY: "auto", height: 350 }} dense disablePadding>
              {visibleTasks.map((task) => {
                const isPublic = task.visibility === "public";
                const isDone = task.status === "completed";
                const isCancelled = task.status === "cancelled";
                const overdue = isOverdue(task);

                return (
                  <ListItem
                    key={task.id}
                    disableGutters
                    onClick={() => openExistingTask(task)}
                    sx={{
                      p: 0,
                      alignItems: "flex-start",
                      borderBottom: "1px solid",
                      borderColor: "#63636322",
                      cursor: "pointer",
                      borderRadius: 1,
                      opacity: isCancelled ? 0.5 : 1,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5, mr: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                            <IconButton
                              title={"Mark as done?"}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isDone) return canComplete === false;
                                setOpenDone(true);
                                setSelectedTaskDone(task)
                              } }
                              disabled={!canComplete}
                              sx={{ p: "2px" }}
                            >
                              {isDone ? (
                                <CheckCircleIcon sx={{ fontSize: 15, color: "success.main" }} />
                              ) : isCancelled ? (
                                <BlockIcon sx={{ fontSize: 15, opacity: 0.5 }} />
                              ) : (
                                <RadioButtonUncheckedIcon sx={{ fontSize: 15, opacity: 0.5 }} />
                              )}
                            </IconButton>

                            {isPublic ? (
                              <PublicIcon sx={{ fontSize: 13, opacity: 0.5 }} />
                            ) : (
                              <LockIcon sx={{ fontSize: 13, opacity: 0.5 }} />
                            )}

                            <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                fontSize: "0.85rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                textDecoration: isDone ? "line-through" : "none",
                              }}
                            >
                              {formatShortTitle(task.title)}
                            </Typography>

                            {(task.target_type === "customer" || task.target_type === "contact") && (
                              <IconButton
                                title={`View full details for ${getValue(task.target_type, task.target_id)}`}
                                sx={{ p: "3px", ml: "2px", mb: "-5px" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/app/${task.target_type}s/${task.target_id}`);
                                }}
                              >
                                <ExitToAppIcon sx={{ fontSize: 13, opacity: 0.5 }} />
                              </IconButton>
                            )}
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                            <Tooltip title={`Priority: ${task.priority}`}>
                              <FlagIcon sx={{ fontSize: 14, color: PRIORITY_COLOR[task.priority] }} />
                            </Tooltip>
                            {task.author_id === userId && (
                              <IconButton
                                sx={{ p: "2px" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDelete(task);
                                }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Box sx={{ display: "flex" }}>
                            <Typography variant="caption" fontSize="0.7rem" sx={{ ml: 1 }}>
                              TASK FOR: 
                            </Typography>
                            <Typography variant="caption" fontSize="0.7rem" sx={{ ml: 1 }}>
                              {formatName(task.assignee.first_name, task.assignee.last_name)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            {task.due_date && (
                              <>
                                <EventIcon sx={{ fontSize: 11, opacity: 0.5, color: overdue ? "error.main" : "inherit" }} />
                                <Typography
                                  variant="caption"
                                  fontSize="0.65rem"
                                  sx={{ color: overdue ? "error.main" : "inherit", fontWeight: overdue ? 700 : 400 }}
                                >
                                  {new Date(task.due_date).toLocaleDateString([], { month: "short", day: "numeric" })}
                                </Typography>
                              </>
                            )}
                            <Typography variant="caption" fontSize="0.6rem" sx={{ ml: 1 }}>
                              {formatName(task.author.first_name, task.author.last_name)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondaryTypographyProps={{ fontSize: "0.7rem" }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          
        </>
      )}

      {view === "editor" && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {error && (
            <Box sx={{ width: "100%", my: 1 }}>
              <ErrorAlert message={error} />
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                <IconButton
                  title="Back"
                  size="small"
                  onClick={() => {
                    setView("list");
                    dispatch(clearError());
                  }}
                  disabled={saving}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box sx={{ ml: 1, opacity: 0.6, width: "100%", display: "flex", flexDirection: "space-between" }}>
                  {activeTask ? (
                    <>
                      <Typography sx={{ ml: 1, fontSize: "12px", opacity: 0.6 }}>
                        {new Date(activeTask.created_at).toLocaleString()}
                      </Typography>
                      <Typography sx={{ ml: 1, fontSize: "12px", opacity: 0.6 }}>
                        {`Author: ${formatName(activeTask.author.first_name, activeTask.author.last_name)}`}
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ ml: 1, opacity: 0.6 }}>New Task</Typography>
                  )}
                </Box>
              </Box>

              {canEdit && (
                <IconButton
                  title="Save and Exit"
                  size="small"
                  disabled={!canSave || saving}
                  onClick={saveAndExit}
                >
                  {!saving ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <CircularProgress size={14} sx={{ mr: 1, justifySelf: "self-end" }} />
                  )}
                </IconButton>
              )}
            </Box>

            {activeTask && activeTask.author_id === userId && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDelete(activeTask);
                }}
                disabled={saving}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "space-between", mx: 1 }}>
            <FormControl size="small">
              <Select
                disabled={!canEdit}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                sx={{
                  width: 150,
                  "& .MuiInputBase-input": {
                    py: "3px",
                    fontSize: 11,
                    fontWeight: 700,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                {members.map((member) => (
                  <MenuItem sx={{ fontSize: 11}} key={member.id} value={member.id}>
                    {member.id === userId ? 'Self' : `${member.display_name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <Select
                disabled={!canEdit}
                value={editVisibility}
                onChange={(e) => setEditVisibility(e.target.value as TaskVisibility)}
                sx={{
                  width: 150,
                  "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem sx={{ fontSize: 11 }} value="private">Private</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="public">Public</MenuItem>
              </Select>
            </FormControl> 
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "space-between", width: '100%' }}>
            <FormControl size="small">
              <Select
                disabled={!canEdit}
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                sx={{
                  width: 150,
                  "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem sx={{ fontSize: 11 }} value="low">Low</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="medium">Medium</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="high">High</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
            <TextField
              disabled={!canEdit}
              size="small"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon sx={{ fontSize: 14, opacity: 0.5 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 150,
                "& .MuiInputBase-input": { py: "3px", pl: 0, fontSize: 11, fontWeight: 700 },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />  
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "space-between", width: '100%' }}>
            <FormControl size="small">
                <Select
                  disabled={!canEdit}
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                  sx={{
                    width: 150,
                    textTransform: 'capitalize',
                    "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                >
                  <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize'}} value="other">other</MenuItem>
                  <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="call">call</MenuItem>
                  <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="sms">sms</MenuItem>
                  <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="email">email</MenuItem>
                  <MenuItem sx={{ fontSize: 11, textTransform: 'capitalize' }} value="meeting">meeting</MenuItem>
                </Select>
              </FormControl>
              {activeTask && canComplete && (
                <FormControl size="small">
                  <Select
                    value={editStatus}
                    onChange={async (e) => {
                      const newStatus = e.target.value as TaskStatus;
                      setEditStatus(newStatus);
                      if (activeId) {
                        await dispatch(
                          completeTask({ id: activeId, completed: newStatus === "completed" })
                        ).unwrap().catch(() => {});
                      }
                    }}
                    sx={{
                      width: 150,
                      "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="todo">To Do</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="in_progress">In Progress</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="completed">Completed</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}
          </Box>
        </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5, mx: 1 }}>
            <FormControl size="small">
              <Select
                disabled={!canEdit}
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value as TaskTargetType);
                  setTargetId("");
                }}
                sx={{
                  width: 150,
                  "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem sx={{ fontSize: 11 }} value="personal">Personal</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="contact">Contacts</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="lead">Leads</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="deal">Deals</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="customer">Customers</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ width: 180, display: 'flex', justifyContent: 'end' }}>
              {targetType !== "personal" && (
                <FormControl size="small">
                  <TextField
                    disabled={!canEdit}
                    select
                    fullWidth
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    sx={{
                      "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return <span style={{ color: "#999" }}>Choose a target from {targetType}</span>;
                        }
                        const item = items.find((i) => i.id === selected);
                        return item?.label ?? "";
                      },
                      MenuProps: {
                        PaperProps: { sx: { maxHeight: 200, overflowY: "auto" } },
                      },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: 11 }}>
                      Choose a target from {targetType}
                    </MenuItem>
                    {items.map((item) => (
                      <MenuItem key={item.id} value={item.id} sx={{ fontSize: 11 }}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              )}
              {activeTask && (activeTask.target_type === "customer" || activeTask.target_type === "contact") && (
                <IconButton
                  title={`View full details for ${getValue(activeTask.target_type, activeTask.target_id)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/${activeTask.target_type}s/${activeTask.target_id}`);
                  }}
                >
                  <ExitToAppIcon sx={{ fontSize: 13, opacity: 0.5 }} />
                </IconButton>
              )}
            </Box>
          </Box>

          <TextField
            disabled={!canEdit}
            size="small"
            fullWidth
            multiline
            placeholder="Title"
            value={formatTitle(editTitle)}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{
              mt: 1,
              overflowX: "auto",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiInputBase-input": {
                py: "3px",
                fontSize: 13,
                fontWeight: 700,
                overflowWrap: "break-word",
              },
            }}
          />

          <Divider sx={{ mb: 1 }} />

          <TextField
            disabled={!canEdit}
            autoFocus
            multiline
            variant="standard"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            InputProps={{ disableUnderline: true }}
            placeholder="Start writing..."
            sx={{
              flex: 1,
              "& .MuiInputBase-root": { height: "100%", alignItems: "flex-start" },
              "& textarea": { height: "100% !important", overflowY: "auto !important" },
            }}
          />
        </Box>
      )}

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this Task ({selectedTask?.title})?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>

          <Button
            color="error"
            onClick={() => {
              if (!selectedTask) return;
              removeTask(selectedTask);
              setOpenDelete(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDone} onClose={() => setOpenDone(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to Mark this Task({selectedTaskDone?.title}) as done?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDone(false)}>Cancel</Button>

          <Button
            color="error"
            onClick={() => {
              if (!selectedTaskDone) return;
              toggleComplete(selectedTaskDone);
              setOpenDone(false);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
