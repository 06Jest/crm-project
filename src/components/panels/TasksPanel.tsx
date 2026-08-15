import { useState, useMemo, useEffect } from "react";
import type { ElementType, ReactNode } from "react";
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
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

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
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CallIcon from "@mui/icons-material/Call";
import SmsIcon from "@mui/icons-material/Sms";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import ContactsIcon from "@mui/icons-material/Contacts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HandshakeIcon from "@mui/icons-material/Handshake";
import GroupIcon from "@mui/icons-material/Group";

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
import { fetchOrgMembers } from "../../store/organizationMemberSlice";

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: "#9e9e9e",
  medium: "#2196f3",
  high: "#ed6c02",
  urgent: "#d32f2f",
};

const STATUS_META: Record<
  TaskStatus,
  { label: string; color: "default" | "info" | "warning" | "success"; icon: ElementType }
> = {
  todo: { label: "To do", color: "default", icon: RadioButtonUncheckedIcon },
  in_progress: { label: "In progress", color: "info", icon: HourglassBottomIcon },
  completed: { label: "Completed", color: "success", icon: CheckCircleIcon },
  cancelled: { label: "Cancelled", color: "default", icon: BlockIcon },
};

const TASK_TYPE_META: Record<TaskType, { label: string; icon: ElementType }> = {
  other: { label: "Other", icon: MoreHorizIcon },
  call: { label: "Call", icon: CallIcon },
  sms: { label: "SMS", icon: SmsIcon },
  email: { label: "Email", icon: EmailIcon },
  meeting: { label: "Meeting", icon: GroupsIcon },
};

const TARGET_META: Record<TaskTargetType, { label: string; icon: ElementType }> = {
  personal: { label: "Personal", icon: PersonIcon },
  contact: { label: "Contact", icon: ContactsIcon },
  lead: { label: "Lead", icon: TrendingUpIcon },
  deal: { label: "Deal", icon: HandshakeIcon },
  customer: { label: "Customer", icon: GroupIcon },
};

const pillFieldSx = {
  width: "100%",
  bgcolor: "action.hover",
  borderRadius: 1.5,
  "& .MuiInputBase-input": { py: "7px", fontSize: 12, fontWeight: 600 },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
} as const;

const filterPillSx = (minWidth: {
  xs: number;
  sm: number;
}) => ({
  minWidth,
  bgcolor: "action.hover",
  borderRadius: 5,

  "& .MuiInputBase-input": {
    py: "4px",
    px: { xs: "8px", sm: "10px" },
    fontSize: { xs: 10, sm: 11 },
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&:hover": {
    bgcolor: "action.selected",
  },
});

const menuItemSx = { fontSize: 11 } as const;
const chipSx = { height: 20, fontSize: 10, fontWeight: 700, "& .MuiChip-label": { px: 0.75 } } as const;

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        display: "block",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        opacity: 0.5,
        mb: 0.4,
      }}
    >
      {children}
    </Typography>
  );
}

export default function TasksPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items: tasks, loading: tL, loaded: tLd, error } = useSelector(
    (state: RootState) => state.tasks
  );

  const {
    items: members,
    loaded: mLd,
  } = useSelector((state: RootState) => state.orgmembers);

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
        if (!mLd) {
          await dispatch(fetchOrgMembers()).unwrap();
        }
      } catch {
        // Error handled by Redux state
      }
    };
    loadData();
  },[tLd, cLd, lLd, dLd, cuLd, mLd, dispatch]);

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
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {error && (
            <Box sx={{ width: "100%", mb: 1 }}>
              <ErrorAlert message={error} />
            </Box>
          )}


          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Tasks
              </Typography>
              {tLd && (
                <Chip
                  size="small"
                  label={visibleTasks.length}
                  sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: "action.selected" }}
                />
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Tooltip title="Refresh">
                <span>
                  {tLd &&
                    (tL ? (
                      <IconButton size="small" disabled>
                        <CircularProgress size={15} />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={refresh}>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    ))}
                </span>
              </Tooltip>

              <Tooltip title="Add task">
                <Paper elevation={0} sx={{ borderRadius: 5, bgcolor: "transparent" }}>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      dispatch(clearError());
                      openNewTask();
                    }}
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Tooltip>
            </Stack>
          </Box>

          <TextField
            size="small"
            fullWidth
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ opacity: 0.5 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "action.hover",
                "& fieldset": { border: "none" },
              },
            }}
          />

          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75 }}
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              pb: 1,
              mb: 0.5,
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                height: 4,
              },
              "& > *": {
                flexShrink: 0,
              },
            }}
          >
            <FormControl size="small">
              <Select
                title="Filter task type"
                value={taskTypeFilter}
                onChange={(e) =>
                  setTaskTypeFilter(e.target.value as "all" | TaskType)
                }
                sx={filterPillSx({
                  xs: 82,
                  sm: 96,
                })}
              >
                <MenuItem sx={menuItemSx} value="all">All types</MenuItem>
                <MenuItem sx={menuItemSx} value="other">Other</MenuItem>
                <MenuItem sx={menuItemSx} value="call">Call</MenuItem>
                <MenuItem sx={menuItemSx} value="sms">SMS</MenuItem>
                <MenuItem sx={menuItemSx} value="email">Email</MenuItem>
                <MenuItem sx={menuItemSx} value="meeting">Meeting</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select
                title="Filter status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | TaskStatus)
                }
                sx={filterPillSx({
                  xs: 92,
                  sm: 104,
                })}
              >
                <MenuItem sx={menuItemSx} value="all">All statuses</MenuItem>
                <MenuItem sx={menuItemSx} value="todo">To Do</MenuItem>
                <MenuItem sx={menuItemSx} value="in_progress">In Progress</MenuItem>
                <MenuItem sx={menuItemSx} value="completed">Completed</MenuItem>
                <MenuItem sx={menuItemSx} value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select
                title="Filter priority"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as "all" | TaskPriority)
                }
                sx={filterPillSx({
                  xs: 86,
                  sm: 96,
                })}
              >
                <MenuItem sx={menuItemSx} value="all">All priorities</MenuItem>
                <MenuItem sx={menuItemSx} value="low">Low</MenuItem>
                <MenuItem sx={menuItemSx} value="medium">Medium</MenuItem>
                <MenuItem sx={menuItemSx} value="high">High</MenuItem>
                <MenuItem sx={menuItemSx} value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select
                title="Filter target"
                value={targetFilter}
                onChange={(e) =>
                  setTargetFilter(e.target.value as "all" | TaskTargetType)
                }
                sx={filterPillSx({
                  xs: 92,
                  sm: 104,
                })}
              >
                <MenuItem sx={menuItemSx} value="all">All targets</MenuItem>
                <MenuItem sx={menuItemSx} value="personal">Personal</MenuItem>
                <MenuItem sx={menuItemSx} value="contact">Contacts</MenuItem>
                <MenuItem sx={menuItemSx} value="lead">Leads</MenuItem>
                <MenuItem sx={menuItemSx} value="deal">Deals</MenuItem>
                <MenuItem sx={menuItemSx} value="customer">Customers</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {tL && !tLd ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress size={22} />
            </Box>
          ) : visibleTasks.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 5, opacity: 0.6 }}>
              <TaskAltIcon sx={{ fontSize: 30, opacity: 0.35, mb: 0.5 }} />
              <Typography variant="body2">
                {tasks.length === 0 ? "No tasks yet" : "No matches found"}
              </Typography>
              {tasks.length === 0 && (
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Create a task to get started
                </Typography>
              )}
            </Box>
          ) : (
            <List sx={{ overflowY: "auto", height: 350, px: 0 }} dense disablePadding>
              {visibleTasks.map((task) => {
                const isPublic = task.visibility === "public";
                const isDone = task.status === "completed";
                const isCancelled = task.status === "cancelled";
                const overdue = isOverdue(task);
                const StatusIcon = STATUS_META[task.status].icon;
                const initials = `${task.assignee.profile.first_name?.[0] ?? ""}${task.assignee.profile.last_name?.[0] ?? ""}`.toUpperCase();

                return (
                  <ListItem
                    key={task.id}
                    disableGutters
                    onClick={() => openExistingTask(task)}
                    sx={{
                      p: 1.1,
                      mb: 0.75,
                      alignItems: "flex-start",
                      cursor: "pointer",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderLeft: "3px solid",
                      borderLeftColor: PRIORITY_COLOR[task.priority],
                      opacity: isCancelled ? 0.55 : 1,
                      transition: "box-shadow .15s ease, background-color .15s ease",
                      "&:hover": { bgcolor: "action.hover", boxShadow: 1 },
                      "&:hover .task-delete-btn": { opacity: 1 },
                    }}
                  >
                    <ListItemText
                      disableTypography
                      primary={
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <IconButton
                            title={"Mark as done?"}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (isDone) return canComplete === false;
                              setOpenDone(true);
                              setSelectedTaskDone(task)
                            } }
                            disabled={!canComplete}
                            size="small"
                            sx={{ p: "2px", mt: "1px" }}
                          >
                            {isDone ? (
                              <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} />
                            ) : isCancelled ? (
                              <BlockIcon sx={{ fontSize: 18, opacity: 0.5 }} />
                            ) : (
                              <RadioButtonUncheckedIcon sx={{ fontSize: 18, opacity: 0.45 }} />
                            )}
                          </IconButton>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  textDecoration: isDone ? "line-through" : "none",
                                  opacity: isDone ? 0.6 : 1,
                                }}
                              >
                                {formatShortTitle(task.title)}
                              </Typography>

                              <Tooltip title={isPublic ? "Public" : "Private"}>
                                {isPublic ? (
                                  <PublicIcon sx={{ fontSize: 13, opacity: 0.4 }} />
                                ) : (
                                  <LockIcon sx={{ fontSize: 13, opacity: 0.4 }} />
                                )}
                              </Tooltip>

                              {(task.target_type === "customer" || task.target_type === "contact") && (
                                <IconButton
                                  title={`View full details for ${getValue(task.target_type, task.target_id)}`}
                                  size="small"
                                  sx={{ p: "2px" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/app/${task.target_type}s/${task.target_id}`);
                                  }}
                                >
                                  <ExitToAppIcon sx={{ fontSize: 13, opacity: 0.45 }} />
                                </IconButton>
                              )}
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.6, mt: 0.5 }}>
                              <Chip
                                size="small"
                                icon={<StatusIcon style={{ fontSize: 14 }} />}
                                label={STATUS_META[task.status].label}
                                color={STATUS_META[task.status].color === "default" ? undefined : STATUS_META[task.status].color}
                                variant={STATUS_META[task.status].color === "default" ? "outlined" : "filled"}
                                sx={chipSx}
                              />

                              <Tooltip title={`Priority: ${task.priority}`}>
                                <Chip
                                  size="small"
                                  icon={<FlagIcon style={{ fontSize: 13, color: PRIORITY_COLOR[task.priority] }} />}
                                  label={task.priority}
                                  variant="outlined"
                                  sx={{
                                    ...chipSx,
                                    textTransform: "capitalize",
                                    borderColor: alpha(PRIORITY_COLOR[task.priority], 0.4),
                                  }}
                                />
                              </Tooltip>

                              {task.due_date && (
                                <Chip
                                  size="small"
                                  icon={<EventIcon style={{ fontSize: 13 }} />}
                                  label={new Date(task.due_date).toLocaleDateString([], { month: "short", day: "numeric" })}
                                  variant="outlined"
                                  color={overdue ? "error" : undefined}
                                  sx={{ ...chipSx, fontWeight: overdue ? 700 : 500 }}
                                />
                              )}
                            </Box>
                          </Box>

                          {task.author_id === userId && (
                            <IconButton
                              className="task-delete-btn"
                              size="small"
                              sx={{ p: "3px", opacity: 0, transition: "opacity .15s ease", flexShrink: 0 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(task);
                              }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: "16px" }} />
                            </IconButton>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.75, pl: 3.5 }}>
                          <Stack direction="row" alignItems="center" spacing={0.6}>
                            <Avatar sx={{ width: 16, height: 16, fontSize: 9, fontWeight: 700, bgcolor: "primary.main", color: "common.white" }}>
                              {initials}
                            </Avatar>
                            <Typography variant="caption" fontSize="0.68rem" sx={{ opacity: 0.75 }}>
                              {formatName(task.assignee.profile.first_name, task.assignee.profile.last_name)}
                            </Typography>
                          </Stack>

                          <Typography variant="caption" fontSize="0.62rem" sx={{ opacity: 0.45 }}>
                            {formatName(task.author.profile.first_name, task.author.profile.last_name)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      )}

      {view === "editor" && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {error && (
            <Box sx={{ width: "100%", mb: 1 }}>
              <ErrorAlert message={error} />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
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

              <Box sx={{ ml: 0.5 }}>
                {activeTask ? (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                    <Typography sx={{ fontSize: 11, opacity: 0.55 }}>
                      {new Date(activeTask.created_at).toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: 11, opacity: 0.55 }}>
                      {`· ${formatName(activeTask.author.profile.first_name, activeTask.author.profile.last_name)}`}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: 13, fontWeight: 700, opacity: 0.7 }}>New Task</Typography>
                )}
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={0.5}>
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

              {canEdit && (
                <Tooltip title="Save changes">
                  <span>
                    <IconButton
                      size="small"
                      disabled={!canSave || saving}
                      onClick={saveAndExit}
                      sx={{
                        bgcolor: canSave && !saving ? "primary.main" : "action.disabledBackground",
                        color: canSave && !saving ? "primary.contrastText" : "text.disabled",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      {!saving ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <CircularProgress size={14} sx={{ color: "inherit" }} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mx: 1,
              mb: 1,
            }}
          >
            <Box>
              <FieldLabel>Assigned to</FieldLabel>
              <FormControl size="small" fullWidth>
                <Select
                  disabled={!canEdit}
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  sx={pillFieldSx}
                >
                  {members.map((member) => (
                    <MenuItem sx={{ fontSize: 11 }} key={member.id} value={member.id}>
                      {member.id === userId ? 'Self' : `${formatName(member.profile.first_name, member.profile.last_name)}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FieldLabel>Visibility</FieldLabel>
              <FormControl size="small" fullWidth>
                <Select
                  disabled={!canEdit}
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value as TaskVisibility)}
                  renderValue={(val) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      {val === "public" ? (
                        <PublicIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                      ) : (
                        <LockIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                      )}
                      <span>{val === "public" ? "Public" : "Private"}</span>
                    </Box>
                  )}
                  sx={pillFieldSx}
                >
                  <MenuItem sx={{ fontSize: 11 }} value="private">
                    <LockIcon sx={{ fontSize: 14, mr: 1, opacity: 0.6 }} /> Private
                  </MenuItem>
                  <MenuItem sx={{ fontSize: 11 }} value="public">
                    <PublicIcon sx={{ fontSize: 14, mr: 1, opacity: 0.6 }} /> Public
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FieldLabel>Priority</FieldLabel>
              <FormControl size="small" fullWidth>
                <Select
                  disabled={!canEdit}
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                  renderValue={(val) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, textTransform: "capitalize" }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: PRIORITY_COLOR[val] }} />
                      {val}
                    </Box>
                  )}
                  sx={pillFieldSx}
                >
                  <MenuItem sx={{ fontSize: 11 }} value="low">Low</MenuItem>
                  <MenuItem sx={{ fontSize: 11 }} value="medium">Medium</MenuItem>
                  <MenuItem sx={{ fontSize: 11 }} value="high">High</MenuItem>
                  <MenuItem sx={{ fontSize: 11 }} value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FieldLabel>Due date</FieldLabel>
              <TextField
                disabled={!canEdit}
                size="small"
                fullWidth
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
                sx={pillFieldSx}
              />
            </Box>

            <Box>
              <FieldLabel>Type</FieldLabel>
              <FormControl size="small" fullWidth>
                <Select
                  disabled={!canEdit}
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                  renderValue={(val) => {
                    const Meta = TASK_TYPE_META[val].icon;
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <Meta style={{ fontSize: 14, opacity: 0.6 }} />
                        {TASK_TYPE_META[val].label}
                      </Box>
                    );
                  }}
                  sx={pillFieldSx}
                >
                  {(Object.keys(TASK_TYPE_META) as TaskType[]).map((key) => (
                    <MenuItem sx={{ fontSize: 11 }} key={key} value={key}>
                      {TASK_TYPE_META[key].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {activeTask && canComplete && (
              <Box>
                <FieldLabel>Status</FieldLabel>
                <FormControl size="small" fullWidth>
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
                    renderValue={(val) => {
                      const Meta = STATUS_META[val].icon;
                      return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                          <Meta style={{ fontSize: 14, opacity: 0.6 }} />
                          {STATUS_META[val].label}
                        </Box>
                      );
                    }}
                    sx={pillFieldSx}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="todo">To Do</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="in_progress">In Progress</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="completed">Completed</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          <Box sx={{ mx: 1, mb: 1 }}>
            <FieldLabel>Related to</FieldLabel>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <FormControl size="small" sx={{ width: 140, flexShrink: 0 }}>
                <Select
                  disabled={!canEdit}
                  value={targetType}
                  onChange={(e) => {
                    setTargetType(e.target.value as TaskTargetType);
                    setTargetId("");
                  }}
                  renderValue={(val) => {
                    const Meta = TARGET_META[val].icon;
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <Meta style={{ fontSize: 14, opacity: 0.6 }} />
                        {TARGET_META[val].label}
                      </Box>
                    );
                  }}
                  sx={pillFieldSx}
                >
                  {(Object.keys(TARGET_META) as TaskTargetType[]).map((key) => (
                    <MenuItem sx={{ fontSize: 11 }} key={key} value={key}>
                      {TARGET_META[key].label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {targetType !== "personal" && (
                <FormControl size="small" fullWidth>
                  <TextField
                    disabled={!canEdit}
                    select
                    fullWidth
                    size="small"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    sx={pillFieldSx}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return <span style={{ opacity: 0.5 }}>Choose a target from {targetType}</span>;
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
                  size="small"
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
              mt: 0.5,
              overflowX: "auto",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiInputBase-input": {
                py: "3px",
                fontSize: 16,
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

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        sx={{zIndex: 2500}}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 320 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
            }}
          >
            <DeleteOutlineIcon sx={{ color: "error.main", fontSize: 20 }} />
          </Box>
          Delete task
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Are you sure you want to delete "{selectedTask?.title}"? This can't be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDelete(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            color="error"
            sx={{ textTransform: "none" }}
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

      <Dialog
        open={openDone}
        onClose={() => setOpenDone(false)}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 320 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
            }}
          >
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
          </Box>
          Mark as done
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Mark "{selectedTaskDone?.title}" as done?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDone(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            color="success"
            sx={{ textTransform: "none" }}
            onClick={() => {
              if (!selectedTaskDone) return;
              toggleComplete(selectedTaskDone);
              setOpenDone(false);
            }}
          >
            Yes, mark done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
