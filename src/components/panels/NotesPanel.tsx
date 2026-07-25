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
import CheckIcon from '@mui/icons-material/Check';
import PushPinIcon from '@mui/icons-material/PushPin';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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
  const userId = user?.id;

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
                { nL ? (
                  <IconButton size="small" disabled={nL}>
                    <CircularProgress size={15} />
                  </IconButton>
                ):(
                  <IconButton size="small" onClick={refresh} disabled={nL}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                )}
                
              </span>
            </Tooltip>
            <TextField
              size="small"
              fullWidth
              placeholder="Search notes..."
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 1 }}>
              <Paper title="Add Note" elevation={2} sx={{ borderRadius: 10 }}>
                <IconButton color="primary" onClick={() => {
                  dispatch(clearError())
                  openNewNote()
                }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Paper>
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <FormControl size="small">
                  <Select
                    title="Filter visibility"
                    value={visibilityFilter}
                    onChange={(e) =>
                      setVisibilityFilter(
                        e.target.value as "all" | NoteVisibility
                      )
                    }
                     sx={{
                      width: 80,
                      '& .MuiInputBase-input': {
                          py: '3px',
                          fontSize: 11,
                          fontWeight: 700
                        },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontSize: 11 }} value="all">All</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="private">Private</MenuItem>
                    <MenuItem sx={{ fontSize: 11 }} value="public">Public</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    title="Filter visibility"
                    value={targetFilter}
                    label="Target"
                    onChange={(e) =>
                      setTargetFilter(
                        e.target.value as "all" | NoteTargetType
                      )
                    }
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
              <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
                {notes.length === 0 ? "No notes yet" : "No matches found"}
              </Typography>
            ) : (
              <List
              sx={{ overflowY: 'auto', height: 325}}
              dense disablePadding>
                {visibleNotes.map((note) => {
                  const isPublic =
                    (note as NoteListItem & { visibility?: NoteVisibility }).visibility === "public";
                  return (
                    <ListItem
                      key={note.id}
                      disableGutters
                      onClick={() => openExistingNote(note)}
                      sx={{
                        p: 0,
                        alignItems: "flex-start",
                        borderBottom: "1px solid",
                        borderColor: "#63636322",
                        cursor: "pointer",
                        borderRadius: 1,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center",justifyContent: 'space-between' , gap: 0.5, mr: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center'}}>
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
                                }}
                              >
                                {formatShortTitle(note.title) } 
                              </Typography>
                              {(note.target_type === 'customer' || note.target_type === 'contact') && (
                              <IconButton 
                              title={`View full details for ${getValue(note.target_type, note.target_id)}`}
                              sx={{p: '3px', ml: '2px', mb: '-5px'}} onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/app/${note.target_type}s/${note.target_id}`)
                              }}>
                                <ExitToAppIcon sx={{ fontSize: 13, opacity: 0.5 }} />
                              </IconButton>
                              )}
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 42}}>
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
                                  <PushPinIcon sx={{color: 'primary.main', fontSize: '15px'}} />
                                ) : (
                                  <PushPinIcon  sx={{ fontSize: '15px', }}/>
                                )}
                              </IconButton>
                              {note.author_id === userId && (
                              <IconButton sx={{p: '2px'}} onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(note)
                              }}>
                                <DeleteOutlineIcon sx={{ fontSize: '15px', }}/>
                              </IconButton>
                              )}
                            </Box>
                          </Box>
                          
                        }
                       secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex'}}>
                              <Typography variant="caption" fontSize="0.7rem" sx={{ ml: 1 }}>
                              • {note.target_type === 'personal' ?`${note.target_type.toUpperCase()}` : `${note.target_type.toUpperCase()} : `}
                            </Typography>
                            <Typography variant="caption" fontSize="0.7rem" sx={{ ml: 1 }}>
                              {getValue(note.target_type, note.target_id)}
                            </Typography>
                            </Box>
                            
                            <Typography variant="caption" fontSize="0.6rem">
                              {new Date(note.updated_at).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {`: ${formatName(note.author.first_name, note.author.last_name)}`}
                            </Typography>
                          </Box>
                       }
                        secondaryTypographyProps={{ fontSize: "0.7rem" }}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
              <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                <IconButton title="Back" size="small" onClick={() => {
                  setView("list")
                  dispatch(clearError())
                }} disabled={saving}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box sx={{ ml: 1,  opacity: 0.6, width: '100%', display: 'flex', flexDirection: 'space-between' }}>
                  {activeNote ? (
                  <>
                    <Typography sx={{ml: 1, fontSize: '12px', opacity: 0.6,}}>{`${new Date(activeNote.created_at).toLocaleString()}`}</Typography>
                    <Typography sx={{ml: 1, fontSize: '12px', opacity: 0.6,}}> {`Author: ${formatName(activeNote.author.first_name, activeNote.author.last_name)}`}</Typography>
                    </>
                  ): (
                     <Typography sx={{ml: 1,  opacity: 0.6,}}>New Note</Typography>
                  ) }
                </Box>
              </Box>
              
              { canEdit && (
              <IconButton title="Save and Exit" size="small"  disabled={!canSave || saving} onClick={saveAndExit} >
                { !saving ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <CircularProgress size={14} sx={{ mr: 1, justifySelf: 'self-end' }} />
                )}
              </IconButton>
              )} 
            </Box>
            
            {activeNote && canEdit && (
              <IconButton sx={{opacity: canEdit ? 1 : 0}} size="small" 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDelete(activeNote)
              }} disabled={saving}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            

            <FormControl size="small">
              <Select
                disabled={!canEdit}
                value={editVisibility}
                label="Visibility"
                onChange={(e) => setEditVisibility(e.target.value as "private" | "public")}
                sx={{
                  width: 80,
                  '& .MuiInputBase-input': {
                      py: '3px',
                      fontSize: 11,
                      fontWeight: 700
                    },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              >
                <MenuItem sx={{ fontSize: 11 }} value="private">Private</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="public">Public</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" >
              <Select
                disabled={!canEdit}
                value={targetType}
                onChange={(e) => {
                  setTargetType(e.target.value as NoteTargetType);
                  setTargetId("");
                }}
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
                <MenuItem sx={{ fontSize: 11 }} value="personal">Personal</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="contact">Contacts</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="lead">Leads</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="deal">Deals</MenuItem>
                <MenuItem sx={{ fontSize: 11 }} value="customer">Customers</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{width: 200}}>
              {targetType !== "personal" && (
              <FormControl size="small" >
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
                    <IconButton
                    title={`View full details for ${getValue(activeNote.target_type, activeNote.target_id)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/${activeNote.target_type}s/${activeNote.target_id}`);
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
              overflowX: 'auto',
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
              '& .MuiInputBase-input': {
                py: '3px',
                fontSize: 13,
                fontWeight: 700,
                overflowWrap: 'break-word',

              },
            }}
        />

          <Divider sx={{ mb: 1 }} />

          <TextField
            disabled={!canEdit}
            autoFocus
            multiline
            variant="standard"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
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
          Are you sure you want to delete this Note({selectedNote?.title})?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>

          <Button
            color="error"
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
