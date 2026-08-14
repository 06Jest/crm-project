import { useState, useMemo, useEffect, type ReactElement } from "react";
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
  DialogContentText,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from '@mui/icons-material/Check';
import PushPinIcon from '@mui/icons-material/PushPin';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotesIcon from '@mui/icons-material/Notes';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BadgeIcon from '@mui/icons-material/Badge';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addNote,
  deletePrivateNote,
  updateNote,
  fetchNotes,
  pinNote,
  clearError,
} from "../../store/notesSlice";
import type { NoteListItem, NoteTargetType, NoteVisibility } from "../../types/notes";
import ErrorAlert from "../Error";
import { fetchContactsLists } from "../../store/contactsSlice";
import { fetchLeadsLists } from "../../store/leadsSlice";
import { fetchDealsLists } from "../../store/dealsSlice";
import { fetchCustomersLists } from "../../store/customersSlice";
import { formatName, formatShortTitle, formatTitle } from "../../utils/formatText";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Person } from "@mui/icons-material";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

type TargetChipColor = "default" | "primary" | "warning" | "success" | "info";

const TARGET_META: Record<
  NoteTargetType,
  { label: string; color: TargetChipColor; icon: ReactElement }
> = {
  personal: { label: "Personal", color: "default", icon: <NotesIcon sx={{ width: 12, height: 12 }} /> },
  contact: { label: "Contact", color: "primary", icon: <Person sx={{ width: 12, height: 12 }} /> },
  lead: { label: "Lead", color: "warning", icon: <TrendingUpIcon sx={{ width: 12, height: 12}} /> },
  deal: { label: "Deal", color: "success", icon: <HandshakeIcon sx={{ width: 12, height: 12 }} /> },
  customer: { label: "Customer", color: "info", icon: <BadgeIcon sx={{ width: 12, height: 12 }} /> },
};

export default function NotesPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { items: notes, loading: nL, loaded: nLd, error } = useSelector(
    (state: RootState) => state.notes
  );
  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads,  loaded:lLd } = useSelector((s: RootState) => s.leads);
  const { items: deals,  loaded: dLd } = useSelector((s: RootState) => s.deals);
  const { items: customers,  loaded: cuLd } = useSelector((s: RootState) => s.customers);

  const contactsMap = useMemo(
  () => new Map(contacts.map(c => [c.id, c])),
  [contacts]
);

  const leadsMap = useMemo(
    () => new Map(leads.map(l => [l.id, l])),
    [leads]
  );

  const dealsMap = useMemo(
    () => new Map(deals.map(d => [d.id, d])),
    [deals]
  );

  const customersMap = useMemo(
    () => new Map(customers.map(c => [c.id, c])),
    [customers]
  );

  const { user } = useAuth();
  const membership = user?.membership?.[0];
  const userId = membership?.id;
  console.log("iKlog:" + userId)

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "editor">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editVisibility, setEditVisibility] = useState<NoteVisibility>("private");
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | NoteVisibility>("all");
  const [targetFilter, setTargetFilter] = useState<"all" | NoteTargetType>("all");
  const [targetType, setTargetType] = useState<NoteTargetType>("personal");
  const [selectedNote, setSelectedNote] = useState<NoteListItem | null>();
  const [openDelete, setOpenDelete] = useState(false);

const [targetId, setTargetId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!nLd) await dispatch(fetchNotes()).unwrap();
        if (!cLd) await dispatch(fetchContactsLists()).unwrap();
        if (!lLd) await dispatch(fetchLeadsLists()).unwrap();
        if (!dLd) await dispatch(fetchDealsLists()).unwrap();
        if (!cuLd) await dispatch(fetchCustomersLists()).unwrap();
      } catch {
        // Error handled by Redux state
      } 
    };
    loadData();
  }, [nLd, cLd, lLd, dLd, cuLd, dispatch]);

  const refresh = async () => {
    try {
      await dispatch(fetchNotes()).unwrap();
    } catch {
      // Error handled by Redux state
    }
  };

  const activeNote = notes.find((n) => n.id === activeId) ?? null;

  const openNewNote = () => {
    resetEditor();
    setActiveId(null);
    setEditText("");
    setEditVisibility("private");
    setView("editor");
    setTargetType("personal");
    setTargetId("");
  };

  const openExistingNote = (note: NoteListItem) => {
    setActiveId(note.id);
    handleEditNote(note);
    setView("editor");
  };


const removeNote = async (note: NoteListItem) => {
  const isAuthor = note.author_id === userId;

  try {
    if (!isAuthor) {
      return;
    } else {
      await dispatch(deletePrivateNote(note.id)).unwrap();
    }
  } catch {
    return;
  }

  if (activeId === note.id) {
    setView("list");
    setActiveId(null);
    setEditText("");
  }
};

 

  const handleEditNote = (note: NoteListItem) => {
    setTargetType(note.target_type);
    setTargetId(note.target_id ?? "");
    setEditVisibility(note.visibility);
    setEditText(note.content);
    setEditTitle(note.title);
  };

  const canSave =
    editText.trim().length > 0 &&
    (targetType === "personal" || targetId.length > 0);


  const items = useMemo(() => {
    switch (targetType) {
      case "contact":
        return contacts.map(c => ({
          id: c.id,
          label: `${c.first_name} ${c.last_name}`,
        }));

      case "lead":
        return leads.map(l => ({
          id: l.id,
          label:  `${l.first_name} ${l.last_name}`
        }));

      case "deal":
        return deals.map(d => ({
          id: d.id,
          label:  d.title.length > 25
            ? `${formatTitle(d.title).slice(0, 25)}...`
            : formatTitle(d.title).toUpperCase()
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
    const content = editText.trim();

    if (!content) {
      if (activeNote) {
        await removeNote(activeNote);
      } else {
        setView("list");
        setActiveId(null);
      }
      return;
    }
     setSaving(true);
    try {
      if (activeId) {
        await dispatch(
          updateNote({
            id: activeId,
            note: {
              title: editTitle,
              content,
              visibility: editVisibility,
              target_type: targetType,
              target_id: targetType === "personal" ? null : targetId,
            }
          })
        ).unwrap();
      } else {
        await dispatch(
          addNote({
            title: editTitle,
            content,
            visibility: editVisibility,
            target_type: targetType,
            target_id: targetType === "personal" ? null : targetId
          })
        ).unwrap();
      }
      setView("list");
      setActiveId(null);
      setEditText("");
      setEditVisibility("private");
      setTargetType("personal");
      setTargetId("");
    } catch {
      // error in state
    } finally {
      setSaving(false);
    }
  };

  const getValue = (type: NoteTargetType, id: string) => {
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

  const visibleNotes = useMemo(() => {
    const search = query.trim().replace(/\s+/g, " ").toLowerCase();

    return notes
      .filter((note) => {
        const updated = new Date(note.updated_at);

        const searchableFields = [
          note.title,
          note.target_type,
          note.visibility,
          getValue(note.target_type, note.target_id),

          
          updated.toLocaleDateString("en-US"), 
          updated.toLocaleDateString("en-US", { month: "short" }), 
          updated.toLocaleDateString("en-US", { month: "long" }), 
          updated.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }), 
          updated.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          }), 
          String(updated.getDate()), 
          String(updated.getFullYear()),
        ];

        const matchesSearch =
          !search ||
          searchableFields.some((field) =>
            field.toLowerCase().includes(search)
          );

        const matchesVisibility =
          visibilityFilter === "all" ||
          note.visibility === visibilityFilter;

        const matchesTarget =
          targetFilter === "all" ||
          note.target_type === targetFilter;

        return matchesSearch && matchesVisibility && matchesTarget;
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return Number(b.pinned) - Number(a.pinned);
        }

        return (
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
        );
      });
  }, [notes, query, visibilityFilter, targetFilter,]);

  const canEdit = !activeNote || activeNote?.author_id === userId;

  const handleOpenDelete = (note: NoteListItem) => {
      setSelectedNote(note); 
      setOpenDelete(true);
  };

  const resetEditor = () => {
  setActiveId(null);
  setEditTitle("");
  setEditText("");
  setEditVisibility("private");
  setTargetType("personal");
  setTargetId("");
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <Tooltip title="Refresh">
              <span>
                {nLd &&
                  (nL ? (
                    <IconButton size="small" disabled={nL}>
                      <CircularProgress size={15} />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={refresh} disabled={nL}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  ))}
              </span>
            </Tooltip>
            <TextField
              size="small"
              fullWidth
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={(theme) => ({
                bgcolor: alpha(theme.palette.text.primary, 0.04),
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid",
                  borderColor: theme.palette.primary.main,
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ opacity: 0.5 }} />
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
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="New note">
                  <Paper
                    elevation={0}
                    sx={(theme) => ({
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    })}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        resetEditor();
                        dispatch(clearError());
                        openNewNote();
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                </Tooltip>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.5, fontWeight: 700, letterSpacing: 0.4 }}
                >
                  {visibleNotes.length} {visibleNotes.length === 1 ? "NOTE" : "NOTES"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 0.5 }}>
                <FormControl size="small">
                  <Select
                    title="Filter visibility"
                    value={visibilityFilter}
                    onChange={(e) =>
                      setVisibilityFilter(
                        e.target.value as "all" | NoteVisibility
                      )
                    }
                    sx={(theme) => ({
                      width: 80,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.text.primary, 0.04),
                      "& .MuiInputBase-input": {
                        py: "3px",
                        fontSize: 11,
                        fontWeight: 700,
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    })}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="all">All</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="private">Private</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="public">Public</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    title="Filter target"
                    value={targetFilter}
                    label="Target"
                    onChange={(e) =>
                      setTargetFilter(
                        e.target.value as "all" | NoteTargetType
                      )
                    }
                    sx={(theme) => ({
                      width: 100,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.text.primary, 0.04),
                      "& .MuiInputBase-input": {
                        py: "3px",
                        fontSize: 11,
                        fontWeight: 700,
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    })}
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

            {nL && !nLd ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress size={22} />
              </Box>
            ) : visibleNotes.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 6,
                  opacity: 0.45,
                }}
              >
                <StickyNote2OutlinedIcon sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {notes.length === 0 ? "No notes yet? tap + to add one" : "No matches found"}
                </Typography>
              </Box>
            ) : (
              <List
                sx={(theme) => ({
                  overflowY: "auto",
                  height: 390,
                  pr: 0.5,
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: alpha(theme.palette.text.primary, 0.15),
                    borderRadius: 3,
                  },
                })}
                dense
                disablePadding
              >
                {visibleNotes.map((note) => {
                  const isPublic =
                    (note as NoteListItem & { visibility?: NoteVisibility }).visibility === "public";
                  const meta = TARGET_META[note.target_type];
                  const targetValue = getValue(note.target_type, note.target_id);
                  const isNavigable = note.target_type === "customer" || note.target_type === "contact";

                  return (
                    <ListItem
                      key={note.id}
                      disableGutters
                      onClick={() => openExistingNote(note)}
                      sx={(theme) => ({
                        display: "block",
                        p: 1.25,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: note.pinned
                          ? alpha(theme.palette.warning.main, 0.08)
                          : "background.paper",
                        border: "1px solid",
                        borderColor: note.pinned
                          ? alpha(theme.palette.warning.main, 0.35)
                          : theme.palette.divider,
                        transition:
                          "border-color 0.15s ease, box-shadow 0.15s ease",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.08)}`,
                        },
                      })}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5, mb: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                              {isPublic ? (
                                <PublicIcon sx={{ fontSize: 13, opacity: 0.5, flexShrink: 0 }} />
                              ) : (
                                <LockIcon sx={{ fontSize: 13, opacity: 0.5, flexShrink: 0 }} />
                              )}

                              <Typography
                                component="span"
                                sx={{
                                  ml: 1,
                                  fontSize: "0.85rem",
                                  fontWeight: 600,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {formatShortTitle(note.title) } 
                              </Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 42, flexShrink: 0}}>
                              <IconButton
                                title="Pin note"
                                onClick={async (e) => {
                                  e.stopPropagation();

                                  await dispatch(
                                    pinNote({
                                      id: note.id,
                                      pinned: !note.pinned,
                                    })
                                  ).unwrap();
                                }}
                                sx={{alignSelf: 'end', p: '2px'}}
                              >
                                {note.pinned ? (
                                  <PushPinIcon sx={{color: 'warning.main', fontSize: '15px'}} />
                                ) : (
                                  <PushPinIcon  sx={{ fontSize: '15px', opacity: 0.4 }}/>
                                )}
                              </IconButton>
                              {note.author_id === userId && (
                              <IconButton
                                title="Delete note"
                                color="error"  sx={{p: '2px'}} onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(note)
                              }}>
                                <DeleteIcon sx={{ fontSize: '15px', }}/>
                              </IconButton>
                              )}
                            </Box>
                          </Box>
                          
                        }
                       secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0}}>
                              <Chip
                                size="small"
                                icon={meta.icon}
                                label={meta.label}
                                variant="outlined"
                                color={meta.color}
                                sx={{
                                  height: 18,
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  '& .MuiChip-icon': { ml: '5px' },
                                  '& .MuiChip-label': { px: '6px' },
                                }}
                              />
                            {targetValue && (
                            <Typography
                            title={isNavigable ? `View full details for ${targetValue}` : 'Note target'}
                            onClick={(e) => {
                               if (!isNavigable) return
                                 e.stopPropagation();
                                 navigate(`/app/${note.target_type}s/${note.target_id}`)
                              }}
                            variant="caption" fontSize="0.7rem" sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              cursor: isNavigable ? 'pointer' : 'default',
                              ":hover": isNavigable ? {textDecoration: 'underline', color: 'primary.main'} : {}
                            }}>
                              {targetValue}
                            </Typography>
                            )}
                            </Box>
                            
                            <Typography variant="caption" fontSize="0.63rem" sx={{ opacity: 0.6, flexShrink: 0 }}>
                              {new Date(note.updated_at).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {` · ${formatName(note.author.profile.first_name, note.author.profile.last_name)}`}
                            </Typography>
                          </Box>
                       }
                        secondaryTypographyProps={{ component: "div" }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
            <Box sx={{height: 30}}>
            </Box>
          </Box>
        </>
      )}

      {view === "editor" && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {error && (
              <Box sx={{ width: "100%", my: 1 }}>
                <ErrorAlert message={error} />
              </Box>
            )}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', minWidth: 0 }}>
              <Tooltip title="Back to notes">
                <IconButton title="Back" size="small" onClick={() => {
                  setView("list")
                  dispatch(clearError())
                }} disabled={saving}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Box sx={{ ml: 1, display: 'flex', gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
                {activeNote ? (
                  <>
                    <Typography sx={(theme) => ({
                      px: 1, py: 0.25, borderRadius: 1,
                      bgcolor: alpha(theme.palette.text.primary, 0.05),
                      fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap',
                    })}>{`${new Date(activeNote.created_at).toLocaleString()}`}</Typography>
                    <Typography sx={(theme) => ({
                      px: 1, py: 0.25, borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap',
                    })}>{`${formatName(activeNote.author.profile.first_name, activeNote.author.profile.last_name)}`}</Typography>
                    </>
                  ): (
                     <Typography sx={{ fontWeight: 700, opacity: 0.55 }}>New Note</Typography>
                  ) }
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
              {activeNote && canEdit && (
                <Tooltip title="Delete note">
                  <IconButton color="error" size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDelete(activeNote)
                  }} disabled={saving}>
                    <DeleteIcon  fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              { canEdit && (
              <Tooltip title={saving ? "Saving…" : "Save and exit"}>
                <span>
                  <IconButton size="small" disabled={!canSave || saving} onClick={saveAndExit}
                    sx={(theme) => ({
                      bgcolor: canSave && !saving ? alpha(theme.palette.success.main, 0.12) : 'transparent',
                      color: canSave && !saving ? 'success.main' : undefined,
                    })}
                  >
                    { !saving ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <CircularProgress size={14} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
              )} 
            </Box>
          </Box>

          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              p: 0.75,
              mb: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.text.primary, 0.03),
              border: '1px solid',
              borderColor: theme.palette.divider,
            })}
          >
            <FormControl size="small">
              <Select
                disabled={!canEdit}
                value={editVisibility}
                label="Visibility"
                onChange={(e) => setEditVisibility(e.target.value as "private" | "public")}
                renderValue={(val) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {val === 'private' ? <LockIcon sx={{ fontSize: 13 }} /> : <PublicIcon sx={{ fontSize: 13 }} />}
                    {val === 'private' ? 'Private' : 'Public'}
                  </Box>
                )}
                sx={{
                  width: 100,
                  '& .MuiInputBase-input': {
                      py: '3px',
                      fontSize: 11,
                      fontWeight: 700
                    },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem sx={{ fontSize: 11 }} value="private">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon sx={{ fontSize: 13 }} /> Private
                  </Box>
                </MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="public">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PublicIcon sx={{ fontSize: 13 }} /> Public
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

            <FormControl size="small" >
              <Select
                disabled={!canEdit}
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value as NoteTargetType);
                  setTargetId("");
                }}
                renderValue={(val) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {TARGET_META[val].icon}
                    {TARGET_META[val].label}
                  </Box>
                )}
                sx={{
                  width: 120,
                  '& .MuiInputBase-input': {
                      py: '3px',
                      fontSize: 11,
                      fontWeight: 700
                    },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem sx={{ fontSize: 11 }} value="personal">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{TARGET_META.personal.icon} Personal</Box>
                </MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="contact">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{TARGET_META.contact.icon} Contacts</Box>
                </MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="lead">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{TARGET_META.lead.icon} Leads</Box>
                </MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="deal">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{TARGET_META.deal.icon} Deals</Box>
                </MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="customer">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{TARGET_META.customer.icon} Customers</Box>
                </MenuItem>
              </Select>
            </FormControl>
            {targetType !== "personal" && (
              <FormControl size="small" sx={{ flex: 1, minWidth: 160 }}>
                <TextField
                disabled={!canEdit}
                select
                fullWidth
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                sx={{
                  
                  '& .MuiInputBase-input': {
                    py: '3px',
                    fontSize: 11,
                    fontWeight: 700
                  },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: '#999' }}>
                            Choose a target from {targetType}
                          </span>
                        );
                      }

                      const item = items.find((i) => i.id === selected);
                      return item?.label ?? '';
                    },
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                          overflowY: 'auto',
                        },
                      },
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
            {activeNote &&
              (activeNote.target_type === "customer" ||
                activeNote.target_type === "contact") && (
                <Tooltip title={`View full details for ${getValue(activeNote.target_type, activeNote.target_id)}`}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/${activeNote.target_type}s/${activeNote.target_id}`);
                    }}
                  >
                    <ExitToAppIcon sx={{ fontSize: 15, opacity: 0.6 }} />
                  </IconButton>
                </Tooltip>
            )}
          </Box>

          <Paper
            elevation={0}
            sx={(theme) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: theme.palette.divider,
              bgcolor: 'background.paper',
            })}
          >
            <TextField
              disabled={!canEdit}
              fullWidth
              multiline
              variant="standard"
              placeholder="Title"
              value={formatTitle(editTitle)}
              onChange={(e) => setEditTitle(e.target.value)}
              InputProps={{ disableUnderline: true }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: 19,
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.35,
                  overflowWrap: 'break-word',
                },
              }}
            />

            <Divider sx={{ my: 1.25 }} />

            <TextField
              disabled={!canEdit}
              autoFocus
              multiline
              variant="standard"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              InputProps={{ disableUnderline: true }}
              placeholder="Start writing..."
              sx={(theme) => ({
                flex: 1,
                minHeight: 0,
                pl: 1.5,
                borderLeft: '2px solid',
                borderColor: alpha(theme.palette.error.main, 0.2),
                "& .MuiInputBase-root": { height: "100%", alignItems: "flex-start" },
                "& textarea": {
                  height: "100% !important",
                  overflowY: "auto !important",
                  fontSize: 14,
                  lineHeight: '26px',
                  backgroundImage: `repeating-linear-gradient(${alpha(
                    theme.palette.text.primary,
                    0.08
                  )} 0px, ${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px, transparent 26px)`,
                  backgroundPositionY: '7px',
                },
              })}
            />
          </Paper>
        </Box>
      )}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        sx={{zIndex: 2500}}
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>
          Delete note?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {selectedNote?.title}
            </Box>
            ? This can't be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disableElevation
            onClick={() => {
              if (!selectedNote) return;
              removeNote(selectedNote);
              setOpenDelete(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
  );
}
