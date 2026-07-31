import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import CampaignIcon from "@mui/icons-material/Campaign";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchConversations,
  createDirectConversation,
  markConversationAsRead,
  clearError as clearConversationError,
} from "../../store/conversationsSlice";

import {
  fetchMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  clearError as clearMessageError,
  clearMessages,
} from "../../store/messagesSlice";

import { CHAT_TARGET_TYPES } from "../../types/chat";
import type {
  ConversationListItem,
  MessageListItem,
  ChatTargetType,
  AddMessage,
} from "../../types/chat";

import { fetchContactsLists } from "../../store/contactsSlice";
import { fetchLeadsLists } from "../../store/leadsSlice";
import { fetchDealsLists } from "../../store/dealsSlice";
import { fetchCustomersLists } from "../../store/customersSlice";

import { formatName, formatShortTitle, formatTitle } from "../../utils/formatText";
import { useAuth } from "../../hooks/useAuth";
import ErrorAlert from "../Error";
import type { ProfileIDName } from "../../types/profile";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { fetchMembersIDNames } from "../../store/ProfileSlice";


type EntitySelectOption = { id: string; label: string };
type EntityChoice = ChatTargetType | "none";

export default function ChatPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAgent} = useAuth();
  const userId = user?.id;

  const {
    items: conversations,
    loading: convLoading,
    loaded: convLoaded,
    error: convError,
  } = useSelector((s: RootState) => s.conversations);

  const {
    items: messages,
    loading: msgLoading,
    loaded: msgLoaded,
    sending,
    error: msgError,
  } = useSelector((s: RootState) => s.messages);

  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loaded: lLd } = useSelector((s: RootState) => s.leads);
  const { items: deals, loaded: dLd } = useSelector((s: RootState) => s.deals);
  const { items: customers, loaded: cuLd } = useSelector((s: RootState) => s.customers);
  const { items: profiles, loaded: pLd } = useSelector((s: RootState) => s.profile);

  const [view, setView] = useState<"list" | "chat">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [entityType, setEntityType] = useState<EntityChoice>("none");
  const [entityId, setEntityId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<ProfileIDName | null>(null);
  const [searchText, setSearchText] = useState("");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<MessageListItem | null>();
    const [openDelete, setOpenDelete] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000); // tick every 30s
    return () => clearInterval(interval);
  }, []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const needsEntityLists = !cLd || !lLd || !dLd || !cuLd || !pLd;
  

useEffect(() => {
  if (!activeId) return;

  const channel = supabase
    .channel(`messages-${activeId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${activeId}`,
      },
      () => {
        dispatch(fetchMessages(activeId));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [activeId, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      if (!convLoaded) {
      await dispatch(fetchConversations()).unwrap();
      }
    }
    loadData();
  }, [convLoaded, dispatch]);

  useEffect(() => {
  }, [conversations]);

  useEffect(() => {
    if (!needsEntityLists) return;

    const loadData = async () => {
      const requests = [];
      if (!cLd) requests.push(dispatch(fetchContactsLists()).unwrap());
      if (!lLd) requests.push(dispatch(fetchLeadsLists()).unwrap());
      if (!dLd) requests.push(dispatch(fetchDealsLists()).unwrap());
      if (!cuLd) requests.push(dispatch(fetchCustomersLists()).unwrap());
      if (!pLd) requests.push(dispatch(fetchMembersIDNames()).unwrap());
      try {
        await Promise.all(requests);
      } catch {
        // Errors are surfaced through their own slices
      }
    };

    loadData();
  }, [dispatch, pLd, cLd, lLd, dLd, cuLd, needsEntityLists]);

  useEffect(() => {
    if (!activeId) return;

    dispatch(clearMessages());
    dispatch(fetchMessages(activeId));
  }, [activeId, dispatch]);

  useEffect(() => {
    if (!messages.length) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  
  const getDisplayName = (conversation: ConversationListItem): string => {
    if (conversation.type === "announcement") return "Announcements";
    if (conversation.type === "organization") return "Organization";

    return conversation.other_participant ? conversation.other_participant.display_name :
     "DM";
  };

  const handleOpenDelete = (message: MessageListItem) => {
        setSelectedMessage(message); 
        setOpenDelete(true);
    };

  const isUnread = useCallback(
    (conversation: ConversationListItem) => {
      if (!conversation.last_message) return false;
      if (conversation.last_message.sender_id === userId) return false;

      if (!conversation.my_last_read_at) return true;

      return (
        new Date(conversation.last_message.created_at).getTime() >
        new Date(conversation.my_last_read_at).getTime()
      );
    },
    [userId]
  );


  const grouped = useMemo(
  () => ({
    announcements: conversations.filter(
      (c) => c.type === "announcement"
    ),

    organization: conversations.filter(
      (c) => c.type === "organization"
    ),

    direct: conversations
      .filter((c) => c.type === "direct")
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
      ),
  }),
  [conversations]
);

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

  const getValue = (
    type: ChatTargetType,
    id: string
) => {

    switch(type){

        case "contact": {
            const c = contactsMap.get(id);
            return c
                ? formatName(c.first_name, c.last_name)
                : "";
        }

        case "lead": {
            const l = leadsMap.get(id);
            return l
                ? formatName(l.first_name, l.last_name)
                : "";
        }

        case "deal": {

            const deal = dealsMap.get(id);

            if(!deal) return "";

            const contact = contactsMap.get(deal.contact_id);

            return contact
                ? `${formatName(contact.first_name, contact.last_name)} 
                ${formatShortTitle(deal.title)}`
                : "";
        }

        case "customer": {

            const customer = customersMap.get(id);

            if(!customer) return "";

            const contact = contactsMap.get(customer.contact_id);

            return contact
                ? formatName(contact.first_name, contact.last_name)
                : "";
        }

        default:
            return "";
    }
}

  const openConversation = async (conversation: ConversationListItem) => {
    setActiveId(conversation.id);
    setView("chat");
    setEntityType("none");
    setEntityId("");
    setEditingId(null);
    setMessageText("");

    try {
      await dispatch(markConversationAsRead(conversation.id)).unwrap();
    } catch {
      // Non-fatal — local read state already reflects the open
    }
  };

  const openOrCreateConversation = async (profileId: string) => {
  // Does one already exist?
    const existing = conversations.find(
      (c) =>
        c.type === "direct" &&
        c.other_participant?.id === profileId
    );

    if (existing) {
      await openConversation(existing);
      return;
    }

    try {
      const conversation = await dispatch(
        createDirectConversation(profileId)
      ).unwrap();

      await openConversation(conversation as ConversationListItem);
    } catch {
      // handled by slice
    }
  };

  const backToList = () => {
    setView("list");
    setActiveId(null);
    dispatch(clearMessages());
    dispatch(clearMessageError());
    dispatch(clearConversationError());
  };

  const entityOptions: EntitySelectOption[] = useMemo(() => {
    switch (entityType) {
      case "contact":
        return contacts.map((c) => ({ id: c.id, label: `${c.first_name} ${c.last_name}` }));

      case "lead":
        return leads.map((l) => ({ id: l.id, label: `${l.first_name} ${l.last_name}` }));

      case "deal":
        return deals.map((d) => ({ id: d.id, label: formatTitle(d.title) }));

      case "customer":
        return customers.map((c) => {
          const contact = contacts.find((co) => co.id === c.contact_id);
          return {
            id: c.id,
            label: contact ? formatName(contact.first_name, contact.last_name) : c.id,
          };
        });

      default:
        return [];
    }
  }, [entityType, contacts, leads, deals, customers]);

  const canSend = messageText.trim().length > 0 && !sending && !!activeId;

  const handleSend = async () => {
    if (!activeId || !canSend) return;

    const payload: AddMessage = {
      content: messageText.trim(),
      entity_type: entityType === "none" ? null : entityType,
      entity_id: entityType === "none" ? null : entityId || null,
    };

    try {
      await dispatch(sendMessage({ conversationId: activeId, message: payload })).unwrap();
      setMessageText("");
    } catch {
      // Error surfaced via msgError
    }
  };

  const startEdit = (message: MessageListItem) => {
    if (message.sender_id !== userId) return;

    setEditingId(message.id);
    setEditingText(message.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    try {
      await dispatch(editMessage({ id: editingId, content: editingText.trim() })).unwrap();
      cancelEdit();
    } catch {
      // Error surfaced via msgError
    }
  };

  const removeMessage = async (id: string) => {
    try {
      await dispatch(deleteMessage(id)).unwrap();
    } catch {
      // Error surfaced via msgError
    }
  };

  const renderConversationRow = (conversation: ConversationListItem) => {
    const unread = isUnread(conversation);
    const preview = conversation.last_message?.content ?? "No messages yet";

    let avatar = (
      <Avatar>
        <PersonIcon fontSize="small" />
      </Avatar>
    );

    if (conversation.type === "announcement") {
      avatar = (
        <Avatar>
          <CampaignIcon fontSize="small" />
        </Avatar>
      );
    } else if (conversation.type === "organization") {
      avatar = (
        <Avatar>
          <BusinessIcon fontSize="small" />
        </Avatar>
      );
    } else if (conversation.other_participant?.id) {
      avatar = (
        <Avatar src={conversation.other_participant.avatar_url ?? undefined}>
         {!conversation.other_participant.avatar_url && (
           <PersonIcon fontSize="small" />
          )}
        </Avatar>
      );
    }

    return (
      <ListItem
        key={conversation.id}
        disableGutters
        onClick={() => openConversation(conversation)}
        sx={{
          py: 1,
          px: 1,
          cursor: "pointer",
          borderBottom: "1px solid",
          borderColor: "#63636322",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ListItemAvatar>{avatar}</ListItemAvatar>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: unread ? 700 : 400, fontSize: "0.9rem" }}>
              {getDisplayName(conversation)}
            </Typography>
          }
          secondary={
            <Typography
              sx={{
                fontWeight: unread ? 700 : 400,
                fontSize: "0.78rem",
                opacity: unread ? 0.9 : 0.6,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {preview}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {view === "list" && (
        <>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", px: 1, pb: 1 }}>
            Chats
          </Typography>

          <Autocomplete
            value={selectedProfile}
            inputValue={searchText}
            size="small"
            options={[...profiles]
            .filter((p) => p.id !== userId)
            .sort((a, b) =>
              a.display_name.localeCompare(b.display_name)
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearOnBlur
            openOnFocus
            getOptionLabel={(option) => option.display_name}
            onChange={(_, profile) => {
              setSelectedProfile(null);
              setSearchText("");
              if (!profile) return;

              openOrCreateConversation(profile.id);
            }}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    <Avatar
                        src={option.avatar_url ?? undefined}
                        sx={{ mr: 1, width: 32, height: 32 }}
                    >
                        {!option.avatar_url && <PersonIcon fontSize="small" />}
                    </Avatar>

                    {formatTitle(option.display_name)}
                </Box>
            )}
            
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search people..."
                    sx={{ px: 1, mb: 1 }}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <SearchIcon
                                    fontSize="small"
                                    sx={{ mr: 1, opacity: .5 }}
                                />
                                {params.InputProps.startAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />

          {convError && (
            <Box sx={{ px: 1, mb: 1 }}>
              <ErrorAlert message={convError} />
            </Box>
          )}

          {convLoading && !convLoaded ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress size={22} />
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <List dense disablePadding>

                {grouped.announcements.map(renderConversationRow)}
                {grouped.organization.map(renderConversationRow)}
                {grouped.direct.map(renderConversationRow)}

                {grouped.announcements.length === 0 &&
                  grouped.organization.length === 0 &&
                  grouped.direct.length === 0 && (
                    <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
                      No conversations found
                    </Typography>
                  )}
              </List>
            </Box>
          )}
        </>
      )}

      {view === "chat" && activeConversation && (
        <Box sx={{ display: "flex", flexDirection: "column", height: 480, overflowY: 'auto' }}>
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "#63636322",
            }}
          >
            <IconButton size="small" title="Back" onClick={backToList}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ ml: 1, fontWeight: 700, fontSize: "0.95rem" }}>
              {getDisplayName(activeConversation)}
            </Typography>
          </Box>

          {msgError && (
            <Box sx={{ px: 1, my: 1 }}>
              <ErrorAlert message={msgError} />
            </Box>
          )}
          
          <Box sx={{ flex: 1, overflowY: "auto",}}>
            <Box
              sx={{
                height: 350,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 3,
                color: "text.secondary",
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 48,
                  opacity: 0.25,
                  mb: 1.5,
                }}
              />

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                Start to say "Good Day!"
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  maxWidth: 250,
                  opacity: 0.75,
                }}
              >
                Start the conversation by sending your first message. You can also
                attach a related contact, customer, lead, or deal to provide additional
                context.
              </Typography>
            </Box>
            {msgLoading && !msgLoaded ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress size={22} />
              </Box>
            ) : messages.length === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
                No messages yet — say hello
              </Typography>
            ) : (
              messages.map((message) => {
                const isOwn = message.sender_id === userId;
                const isEditing = editingId === message.id;

                return (
                  <Box
                    key={message.id}
                    sx={{
                      display: "flex",
                      flexDirection: 'row',
                      justifyContent: isOwn ? "flex-end" : "flex-start",
                      mb: 1,
                      mr: 1
                    }}
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  > 
                    {isOwn && !isEditing && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isOwn ? "flex-end" : "flex-start",
                        alignItems: "center",
                        gap: 0.5,
                        mr: 1,
                        opacity: hoveredMessageId === message.id ? 1 : 0
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', opacity: 0.5 }}>
                        {new Date(message.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.edited_at ? " (edited)" : ""}
                      </Typography> 

                      <>
                        {now - new Date(message.created_at).getTime() < 15 * 60 * 1000 && (
                          <IconButton size="small" sx={{ p: "2px" }} onClick={() => startEdit(message)}>
                            <EditIcon sx={{ fontSize: '0.85rem' }} />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          sx={{ p: "2px" }}
                          
                          onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDelete(message)
                              }}
                        >
                          <DeleteIcon sx={{ fontSize: '0.85rem' }} />
                        </IconButton>
                      </>
                    </Box>
                    )}
                    <Box 
                     
                      sx={{ maxWidth: "70%" }}>

                      <Box sx={{display: 'flex', justifySelf: isOwn ?'end' : 'start',}}>
                        {!isOwn && (
                          <Box
                            title={formatName(message.sender.first_name, message.sender.last_name)}
                            sx={{cursor: 'pointer', height: 30, width: 30, border: '1px solid #bebebea2', borderRadius: 10, mr: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <PersonIcon sx={{ fontSize: '22px'}}/>   
                          </Box>
                        )}
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1.5,
                            py: 0.6,
                            display: 'flex',
                            borderRadius: 5,
                            flexDirection: 'column',
                            justifySelf: isOwn ?'end' : 'start',
                            width: "fit-content",
                            minWidth: 30,
                            maxWidth: 270,
                            wordBreak: "break-word",
                            bgcolor: isOwn ? "primary.main" : "background.paper",
                            color: isOwn ? "primary.contrastText" : "text.primary",
                            border: isOwn ? "none" : "1px solid #63636322",
                          }}
                        >
                          {isEditing ? (
                            <Box sx={{maxWidth: '100%', display: "flex", flexDirection: 'column', alignItems: "center", backgroundColor: '#e2e2e200' }}>
                              <TextField
                                size="small"
                                variant="standard"
                                multiline
                                fullWidth
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                  width: "100%",
                                  "& .MuiInputBase-root": {
                                    fontSize: '0.85rem',
                                    borderRadius: 2,
                                    px: 1,
                                    py: 0.5,
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: '0.85rem',
                                    color: "#f8f7f7",
                                  },
                                  "& textarea": {
                                    fontSize: '0.85rem',
                                    color: "#f5f4f4",
                                  },
                                }}
                                autoFocus
                              />
                              <Box sx={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                <IconButton sx={{p: '3px'}}  onClick={saveEdit}>
                                  <CheckIcon sx={{fontSize: '0.85rem', color: 'white'}} />
                                </IconButton>
                                <IconButton  sx={{p: '3px'}} onClick={cancelEdit}>
                                  <CloseIcon sx={{fontSize: '0.85rem', color: 'white'}} />
                                </IconButton>
                              </Box>
                            </Box>
                          ) : (

                            <Typography sx={{ fontSize: "0.85rem", whiteSpace: "pre-wrap", fontStyle: message.deleted_at ? "italic" : "normal",  }}>
                              { message.deleted_at === null ? message.content : 'Message deleted'}
                            </Typography>
                          )} 
                                  
                          {message.entity_type && message.entity_id && (
                            <Paper
                              onClick={(e) => {
                                if (message.entity_type !== 'customer' && message.entity_type !== 'contact') return
                                e.stopPropagation();
                                navigate(`/app/${message.entity_type}s/${message.entity_id}`)
                                }}
                                title={`View ${getValue(message.entity_type, message.entity_id)} Details`}
                                elevation={2} 
                                sx={{
                                display: 'flex',
                                width: "fit-content",
                                maxWidth: "100%", 
                                alignItems: 'start',
                                justifyContent: 'start', 
                                backgroundColor: '#f3f3f3', 
                                color: '#1b1b1b', mt: 1,  
                                borderRadius: 2, 
                                p: 1, 
                                cursor:'pointer', 
                                "&:hover": {backgroundColor: '#e0e0e0'}
                              }}>
                              <Box sx={{ height: 40, width: 40, border: '1px solid #bebebea2', borderRadius: 10, mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <PersonIcon sx={{ fontSize: '22px'}}/>
                              </Box>
                              <Box 
                              sx={{
                                flex: "none",
                                minWidth: 0,
                              }}>
                                <Typography sx={{ fontSize: "0.85rem",fontWeight: 700, opacity: 0.7, mt: 0.5,  }}>
                                {message.entity_type.toUpperCase()}
                                </Typography>
                                <Typography sx={{ fontSize: "0.85rem",whiteSpace: "pre-line", opacity: 0.7, mt: 0.5,  }}>
                                • {getValue(message.entity_type, message.entity_id)}
                                </Typography>
                              </Box>
                            </Paper>
                          )}
                        </Paper>
                      </Box>
                      
                    </Box>
                    {!isOwn && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isOwn ? "flex-end" : "flex-start",
                        alignItems: "center",
                        gap: 0.5,
                        ml: 1,
                        opacity: hoveredMessageId === message.id ? 1 : 0
                      }}
                    >
                      <Typography sx={{ fontSize: "0.75rem", opacity: 0.5 }}>
                        {new Date(message.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.edited_at ? " (edited)" : ""}
                      </Typography> 
                    </Box>
                    )}
                  </Box>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />
          {isAgent && activeConversation.type === 'announcement' ? (
          <Box sx={{mt: 1, textAlign: 'center'}}>
              Only Admins can Chat in Announcement
          </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", p: 0.5 }}>
            <Box>
              <FormControl size="small">
                <Select
                  value={entityType}
                  onChange={(e) => {
                    setEntityType(e.target.value as EntityChoice);
                    setEntityId("");
                  }}
                  sx={{
                    width: 100,
                    "& .MuiInputBase-input": { py: "3px", fontSize: '0.85rem', fontWeight: 700, p: 0 },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                >
                  <MenuItem sx={{ fontSize: '0.85rem' }} value="none">
                    None
                  </MenuItem>
                  {CHAT_TARGET_TYPES.map((t) => (
                    <MenuItem key={t} sx={{ fontSize: '0.85rem' }} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {entityType !== "none" && (
                <FormControl size="small" sx={{ width: 130 }}>
                  <TextField
                    select
                    size="small"
                    fullWidth
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected) => {
                        if (!selected) {
                          return (
                            <span style={{ color: "#999", fontSize: '0.85rem' }}>Choose {entityType}</span>
                          );
                        }
                        const opt = entityOptions.find((o) => o.id === selected);
                        return opt?.label ?? "";
                      },
                      MenuProps: {
                        PaperProps: { sx: { maxHeight: 200, overflowY: "auto" } },
                      },
                    }}
                    sx={{
                      "& .MuiInputBase-input": { py: "3px", fontSize: '0.85rem', p: 0  },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  >
                    {entityOptions.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id} sx={{ fontSize: '0.85rem' }}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              )}
            </Box>

            <TextField
              size="small"
              fullWidth
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <Tooltip title="Send">
              <span>
                <IconButton color="primary" disabled={!canSend} onClick={handleSend}>
                  {sending ? <CircularProgress size={18} /> : <SendIcon fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          )}
        </Box>
      )}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 40,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>
          Delete message?
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{fontSize: '0.95rem'}}>
            Are you sure you want to delete{' '}
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {selectedMessage && formatShortTitle(selectedMessage.content)}
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
              if (!selectedMessage) return;
              removeMessage(selectedMessage?.id)
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


