
EXMPLE STATE IN DASHBOARD:
  const { items: contacts, loading: cL, error: cE, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loading: lL, loaded:lLd } = useSelector((s: RootState) => s.leads);
  const { items: deals, loading: dL, loaded: dLd } = useSelector((s: RootState) => s.deals);
  const { items: customers, loading: cuL, loaded: cuLd } = useSelector((s: RootState) => s.customers);
 const needsLoading = !cLd || !lLd || !dLd || !cuLd;

  useEffect(() => {
  if (!needsLoading) return;

  const loadData = async () => {
    const requests = [];

    if (!cLd) requests.push(dispatch(fetchContactsLists()).unwrap());
    if (!lLd) requests.push(dispatch(fetchLeadsLists()).unwrap());
    if (!dLd) requests.push(dispatch(fetchDealsLists()).unwrap());
    if (!cuLd) requests.push(dispatch(fetchCustomersLists()).unwrap());

    await Promise.all(requests);
  };

  loadData();
}, [
  dispatch,
  cLd,
  lLd,
  dLd,
  cuLd,
  needsLoading
]);

CONVERSATION SLICE: 

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  ConversationListItem,
  ConversationsState,
} from "../types/chat";

import {
  fetchConversationsAPI,
  fetchDirectConversationAPI,
  createDirectConversationAPI,
} from '../services/chatService';

const initialState: ConversationsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  "chat/conversations",
  async (_, thunkAPI) => {
    try {
      return await fetchConversationsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch conversations"
      );
    }
  }
);

export const fetchDirectConversation = createAsyncThunk(
  "chat/direct-conversation",
  async (userId: string, thunkAPI) => {
    try {
      return await fetchDirectConversationAPI(userId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch direct conversation"
      );
    }
  }
);

export const createDirectConversation = createAsyncThunk(
  "chat/create-direct-conversation",
  async (profileId: string, thunkAPI) => {
    try {
      return await createDirectConversationAPI(profileId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to create direct conversation"
      );
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    clearConversations(state) {
      state.items = [];
      state.loaded = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchConversations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchConversations.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchDirectConversation.pending, (state) => {
      state.error = null;
    });

    builder.addCase(fetchDirectConversation.fulfilled, (state, action) => {
      const conversation = action.payload;

      if (!conversation) return;

      const exists = state.items.some(
        (item) => item.id === conversation.id
      );

      if (!exists) {
        state.items.unshift(conversation as ConversationListItem);
      }
    });

    builder.addCase(fetchDirectConversation.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(createDirectConversation.pending, (state) => {
      state.error = null;
    });

    builder.addCase(createDirectConversation.fulfilled, (state, action) => {
      const exists = state.items.some(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.unshift(action.payload as ConversationListItem);
      }
    });

    builder.addCase(createDirectConversation.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  clearError,
  clearConversations,
} = conversationSlice.actions;

export default conversationSlice.reducer;

MESSAGES SLICE: 

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  AddMessage,
  MessagesState,
} from "../types/chat";

import {
  fetchMessagesAPI,
  sendMessageAPI,
  editMessageAPI,
  deleteMessageAPI,
} from "../services/chatService";

const initialState: MessagesState = {
  items: [],
  loading: false,
  loaded: false,
  sending: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "chat/messages",
  async (conversationId: string, thunkAPI) => {
    try {
      return await fetchMessagesAPI(conversationId);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/send-message",
  async (
    {
      conversationId,
      message,
    }: {
      conversationId: string;
      message: AddMessage;
    },
    thunkAPI
  ) => {
    try {
      return await sendMessageAPI(
        conversationId,
        message
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to send message"
      );
    }
  }
);

export const editMessage = createAsyncThunk(
  "chat/edit-message",
  async (
    {
      id,
      content,
    }: {
      id: string;
      content: string;
    },
    thunkAPI
  ) => {
    try {
      return await editMessageAPI(
        id,
        content
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to edit message"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "chat/delete-message",
  async (id: string, thunkAPI) => {
    try {
      return await deleteMessageAPI(id);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to delete message"
      );
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    clearMessages(state) {
      state.items = [];
      state.loaded = false;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });

    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(sendMessage.pending, (state) => {
      state.sending = true;
      state.error = null;
    });

    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sending = false;
      state.items.push(action.payload);
    });

    builder.addCase(sendMessage.rejected, (state, action) => {
      state.sending = false;
      state.error = action.payload as string;
    });

    builder.addCase(editMessage.pending, (state) => {
      state.error = null;
    });

    builder.addCase(editMessage.fulfilled, (state, action) => {

      const index = state.items.findIndex(
        (message) => message.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }

    });

    builder.addCase(editMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(deleteMessage.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteMessage.fulfilled, (state, action) => {

      state.items = state.items.filter(
        (message) => message.id !== action.payload
      );

    });

    builder.addCase(deleteMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });

  },
});

export const {
  clearError,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;


export interface ConversationsState {
  items: ConversationListItem[],
  loading: boolean,
  loaded: boolean,
  error: string | null
}

export interface MessagesState {
  items: MessageListItem[],
  loading: boolean,
  loaded: boolean,
  sending: boolean,
  error: string | null
}
export const CONVERSATION_TYPES = [
  "announcement",
  "organization",
  "direct",
] as const;

export type ConversationType = typeof CONVERSATION_TYPES[number];

export const CHAT_TARGET_TYPES = [
  "lead",
  "contact",
  "deal",
  "customer",
] as const;

export type ChatTargetType = typeof CHAT_TARGET_TYPES[number];

export interface ChatTarget {
  entity_type: ChatTargetType;
  entity_id: string;
}


export interface Conversation {
  id: string;
  org_id: string;
  type: ConversationType;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_id: string;
  deleted_at: string | null;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  profile_id: string;
  joined_at: string;
  last_read_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  entity_type: ChatTargetType | null;
  entity_id: string | null;
  created_at: string;
  updated_at: string;
  edited_at: string | null;
  deleted_at: string | null;
}

export interface CreateConversation {
  type: ConversationType;
  member_ids: string[];
}


export interface AddMessage {
  content: string;
  entity_type?: ChatTargetType | null;
  entity_id?: string | null;
}


export interface ConversationWithLastMessage extends Conversation {

  last_message: {
    id: string,
    sender_id: string,
    content: string,
    created_at: string
  } | null;

}

export interface ConversationListItem extends ConversationWithLastMessage {

  last_message: {
    id: string,
    sender_id: string,
    content: string,
    created_at: string
  } | null;

  other_participant_id?: string;
}

export interface UserConversationData {
  conversations: ConversationWithLastMessage[];
  members: {
    conversation_id: string;
    profile_id: string;
  }[];
}

export interface MessageListItem extends Message {
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export interface ConversationMemberListItem
  extends ConversationMember {
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

file imports '../../store/(slice)
app dispatch '../../store/store'
types '../../types/chat.ts

theme: 
import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary:{
        main: '#AD7450',
        light: '#ebaa82',
        dark: '#775038',
      },

      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },

    typography: {
      fontFamily: '"Roboto", "Lexend Exa", "Helvetica", "Arial", sans-serif, ',
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
            
          },
          
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
       MuiDialog: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
      MuiPopover: {
        defaultProps: {
          disableScrollLock: true,
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            border: mode === 'dark' ? '1px solid #333' : 'none',
          },
        },
      },
    },
  });


unread will just font bold, read will be default


Redux Ready
Uses your existing:
conversationSlice
messageSlice
fetchConversations
fetchMessages
sendMessage
editMessage
deleteMessage
createDirectConversation
markConversationAsRead


1 file only
react, typescript, mui

no tanstack

chat ui default view(messenger like)

┌─────────────────────────────────────────────┐
│ Chats                                       │
├─────────────────────────────────────────────┤
│ 🔍 Search people...                         │
├─────────────────────────────────────────────┤

📢 ANNOUNCEMENTS
Quarterly sales meeting tomorrow at 10 AM...
______________________________________________


🏢 ORGANIZATION
Welcome our new team members...
______________________________________________


👤 John Doe
Can you review the proposal?
______________________________________________

👤 Jane Smith
I'll finish the report today.
______________________________________________

👤 Michael Lee
Thanks! See you tomorrow.
______________________________________________

👤 Sarah Wilson
I've updated the customer record.
______________________________________________


______________________________________________


view 2(clicking any conversation)
┌─────────────────────────────────────────────┐
│ ← John Doe                                  │
├─────────────────────────────────────────────┤


                                  Messages...


Messages...


                                  Messages...



Messages...



                                  Messages...



Messages...
______________________________________________
add entity type (select)
add add entity id(select) Type a message...     send button           
──────────────────────────────────────────────

You may use this as reference for convention but not really as a copy machine:
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
import { Person } from "@mui/icons-material";

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
                  resetEditor();
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
                            <Box sx={{ alignSelf: 'center', height: 10, width: 10, border: '1px solid #ccc', borderRadius: 10, ml: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <Person sx={{ fontSize: '8px'}}/>
                            </Box>
                            <Typography
                            title={(note.target_type !== 'customer' && note.target_type !== 'contact') ? 'Note Target':`View full details for ${getValue(note.target_type, note.target_id)}`}
                            onClick={(e) => {
                               if (note.target_type !== 'customer' && note.target_type !== 'contact') return
                                 e.stopPropagation();
                                 navigate(`/app/${note.target_type}s/${note.target_id}`)
                              }}
                            variant="caption" fontSize="0.7rem" sx={{ ml: '2px', ":hover": {textDecoration: 'underline', color: 'primary.main'} }}>
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
