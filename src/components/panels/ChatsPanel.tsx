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
import { alpha, type Theme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchConversations,
  createDirectConversation,
  markConversationAsRead,
  clearError as clearConversationError,
  updateRealtimeConversation,
} from "../../store/conversationsSlice";

import {
  fetchMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  clearMessages,
  clearError as clearMessageError,
  addRealtimeMessage,
  updateRealtimeMessage,
  // removeRealtimeMessage,
} from "../../store/messagesSlice";

import { CHAT_TARGET_TYPES } from "../../types/chat";
import type {
  ConversationListItem,
  MessageListItem,
  ChatTargetType,
  AddMessage,
  Message,
} from "../../types/chat";

import { fetchContactsLists } from "../../store/contactsSlice";
import { fetchLeadsLists } from "../../store/leadsSlice";
import { fetchDealsLists } from "../../store/dealsSlice";
import { fetchCustomersLists } from "../../store/customersSlice";

import { formatName, formatShortTitle, formatTitle } from "../../utils/formatText";
import { useAuth } from "../../hooks/useAuth";
import ErrorAlert from "../Error";
import { useNavigate } from "react-router-dom";
import { supabase, syncRealtimeAuth } from "../../services/supabase";
import { fetchOrgMembers } from "../../store/organizationMemberSlice";
import type { DisplayOrganizationMember } from "../../types/organization.member";


type EntitySelectOption = { id: string; label: string };
type EntityChoice = ChatTargetType | "none";

const AVATAR_PALETTE = [
  "#4f5fce",
  "#0f8f7a",
  "#c4577a",
  "#c17d2a",
  "#7965d1",
  "#2c8fb0",
  "#b1544a",
  "#4a935a",
];

function stringToAvatarColor(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = input.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function relativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}


export default function ChatPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAgent} = useAuth();
  const userId = user?.id;
  const memberId = user?.membership?.[0].id;
  
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
  const { items: members, loaded: pLd } = useSelector((s: RootState) => s.orgmembers);

  const [view, setView] = useState<"list" | "chat">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [entityType, setEntityType] = useState<EntityChoice>("none");
  const [entityId, setEntityId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<DisplayOrganizationMember | null>(null);
  const [searchText, setSearchText] = useState("");
  const [realtimeReady, setRealtimeReady] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageListItem | null>();
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const membersMap = useMemo(
    () => new Map(members.map((m) => [m.id, m])),
    [members]
  );

  const conversationsRef = useRef(conversations);
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000); // tick every 30s
    return () => clearInterval(interval);
  }, []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const needsEntityLists = !cLd || !lLd || !dLd || !cuLd || !pLd;
  
useEffect(() => {
  if (!userId) return;

  let cancelled = false;

  const sync = async () => {
    const success = await syncRealtimeAuth();

    if (!cancelled) {
      setRealtimeReady(success);
    }
  };

  sync();

  return () => {
    cancelled = true;
  };
}, [userId]);


useEffect(() => {
  if (!userId || !memberId || !realtimeReady) return;

  const channel = supabase
    .channel(`conversation-members-${memberId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "conversation_members",
        filter: `member_id=eq.${memberId}`,
      },
      (payload) => {
        const row = payload.new as {
          conversation_id: string;
          member_id: string;
          last_read_at: string | null;
        };

        dispatch(
          updateRealtimeConversation({
            id: row.conversation_id,
            last_read_at: row.last_read_at,
          })
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [
  userId,
  memberId,
  realtimeReady,
  dispatch,
]);

useEffect(() => {
  if (!activeId || !userId || !realtimeReady) return;

  const channel = supabase
    .channel(`messages-${activeId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as Message;
          const senderMember = membersMap.get(row.sender_id);

          if (!senderMember) {
            dispatch(fetchMessages(activeId));
            return;
          }

          dispatch(
            addRealtimeMessage({
              ...row,
              sender: { id: senderMember.id, profile: senderMember.profile },
            })
          );

          if (row.sender_id !== memberId) {
            dispatch(markConversationAsRead(activeId));
            dispatch(
              updateRealtimeConversation({
                id: activeId,
                last_read_at: new Date().toISOString(),
              })
            );
          }
        } else if (payload.eventType === "UPDATE") {
          dispatch(updateRealtimeMessage(payload.new as MessageListItem));
        }
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [activeId, userId, memberId, realtimeReady, dispatch, membersMap]);

const conversationsRefreshTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

useEffect(() => {
  if (!userId || !realtimeReady) return;

  const channel = supabase
    .channel("conversations-list")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as Message;
          const existing = conversationsRef.current.find((c) => c.id === row.conversation_id);

          if (!existing) {
            dispatch(fetchConversations());
            return;
          }

          dispatch(
            updateRealtimeConversation({
              id: existing.id,
              last_message: { id: row.id, content: row.content, created_at: row.created_at, sender: { id: row.sender_id } },
              updated_at: row.created_at,
              ...(row.sender_id === memberId ? { last_read_at: row.created_at } : {}),
            })
          );
          return;
        }

        clearTimeout(conversationsRefreshTimeout.current);
        conversationsRefreshTimeout.current = setTimeout(
          () => dispatch(fetchConversations()),
          300
        );
      }
    )
    .subscribe();

  return () => {
    clearTimeout(conversationsRefreshTimeout.current);
    supabase.removeChannel(channel);
  };
}, [userId, realtimeReady, dispatch]);

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
      if (!pLd) requests.push(dispatch(fetchOrgMembers()).unwrap());
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

    return conversation.other_participant
    ? `${conversation.other_participant.profile.first_name} 
      ${conversation.other_participant.profile.last_name}`
    : "DM";
  };

  const handleOpenDelete = (message: MessageListItem) => {
        setSelectedMessage(message); 
        setOpenDelete(true);
    };

  const isUnread = useCallback(
    (conversation: ConversationListItem) => {
      if (conversation.id === activeId) return false; 
      if (!conversation.last_message) return false;
      if (conversation.last_message.sender.id === memberId) return false;
      if (!conversation.last_read_at) return true;
      return new Date(conversation.last_message.created_at).getTime() >
            new Date(conversation.last_read_at).getTime();
    },
    [memberId, activeId]
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

useEffect(() => {
}, [conversations, grouped]);

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

    dispatch(
      updateRealtimeConversation({
        id: conversation.id,
        last_read_at: new Date().toISOString(),
      })
    );

    try {
      await dispatch(markConversationAsRead(conversation.id)).unwrap();
    } catch {
      // redux error
    }
  };

  const openOrCreateConversation = async (memberId: string) => {
    const existing = conversations.find(
      (c) =>
        c.type === "direct" &&
        c.other_participant?.id === memberId
    );

    if (existing) {
      await openConversation(existing);
      return;
    }

    try {
      const conversation = await dispatch(
        createDirectConversation(memberId)
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

    const conversationId = activeId;

    const payload: AddMessage = {
      content: messageText.trim(),
      entity_type: entityType === "none" ? null : entityType,
      entity_id: entityType === "none" ? null : entityId || null,
    };

    try {
      const sent = await dispatch(sendMessage({ conversationId, message: payload })).unwrap();
      setMessageText("");
      dispatch(updateRealtimeConversation({
        id: conversationId,
        last_message: {
          id: sent.id,
          content: sent.content,
          created_at: sent.created_at,
          sender: { id: sent.sender_id ?? sent.sender.id },
        },
        updated_at: sent.created_at,
        last_read_at: sent.created_at,
      }));

      await dispatch(markConversationAsRead(conversationId)).unwrap();
    } catch {
      // Error in redux
    }
  };

  const startEdit = (message: MessageListItem) => {
    if (message.sender_id !== memberId) return;

    setEditingId(message.id);
    setEditingText(message.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    const id = editingId;

    try {
      setSavingEdit(true);

      await dispatch(
        editMessage({
          id,
          content: editingText.trim(),
        })
      ).unwrap();

      cancelEdit();
    } catch {
      // Error surfaced via msgError
    } finally {
      setSavingEdit(false);
    }
  };

  const removeMessage = async (id: string) => {
    try {
      setDeletingId(id);

      await dispatch(deleteMessage(id)).unwrap();

      setOpenDelete(false);
      setSelectedMessage(null);
    } catch {
      // Error surfaced via msgError
    } finally {
      setDeletingId(null);
    }
  };


  const MESSAGE_MODIFY_WINDOW_MS = 15 * 60 * 1000;
  const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;

  const canModifyMessage = (message: MessageListItem) => {
    if (message.deleted_at) return false;
    if (message.sender_id !== memberId) return false;

    const age = now - new Date(message.created_at).getTime();

    return age < MESSAGE_MODIFY_WINDOW_MS &&
          age > -CLOCK_SKEW_TOLERANCE_MS;
  };

  

  const renderConversationRow = (conversation: ConversationListItem) => {
    const unread = isUnread(conversation);
    const preview = conversation.last_message?.content ?? "No messages yet";
    const displayName = getDisplayName(conversation);

    let avatar = (
      <Avatar sx={{ bgcolor: stringToAvatarColor(displayName) }}>
        <PersonIcon fontSize="small" />
      </Avatar>
    );

    if (conversation.type === "announcement") {
      avatar = (
        <Avatar sx={{ bgcolor: "warning.main" }}>
          <CampaignIcon fontSize="small" />
        </Avatar>
      );
    } else if (conversation.type === "organization") {
      avatar = (
        <Avatar sx={{ bgcolor: "info.main" }}>
          <BusinessIcon fontSize="small" />
        </Avatar>
      );
    } else if (conversation.other_participant?.id) {
      avatar = (
        <Avatar
          src={conversation.other_participant.profile.avatar_url ?? undefined}
          sx={{ bgcolor: stringToAvatarColor(displayName) }}
        >
         {!conversation.other_participant.profile.avatar_url && (
           getInitials(displayName)
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
          mb: 0.25,
          borderRadius: 2,
          cursor: "pointer",
          transition: "background-color 0.15s ease",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ListItemAvatar>
          <Box sx={{ position: "relative", width: 40 }}>
            {avatar}
            {unread && (
              <Box
                sx={{
                  position: "absolute",
                  top: -2,
                  right: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  border: "2px solid",
                  borderColor: "background.paper",
                }}
              />
            )}
          </Box>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Typography noWrap sx={{ fontWeight: unread ? 700 : 600, fontSize: "0.88rem" }}>
                {displayName}
              </Typography>
              {conversation.last_message && (
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    flexShrink: 0,
                    color: unread ? "primary.main" : "text.secondary",
                    fontWeight: unread ? 700 : 400,
                  }}
                >
                  {relativeTime(conversation.last_message.created_at)}
                </Typography>
              )}
            </Box>
          }
          secondary={
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mt: "1px" }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: unread ? 600 : 400,
                  fontSize: "0.78rem",
                  color: unread ? "text.primary" : "text.secondary",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {preview}
              </Typography>
              {unread && (
                <Box
                  sx={{
                    minWidth: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {view === "list" && (
        <>
          <Autocomplete
            value={selectedProfile}
            inputValue={searchText}
            size="small"
            options={[...members]
            .filter((p) => p.id !== memberId)
            .sort((a, b) =>
              formatName(a.profile.first_name, a.profile.last_name).localeCompare(formatName(b.profile.first_name, b.profile.last_name))
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearOnBlur
            openOnFocus
            getOptionLabel={(option) =>
                `${formatName(option.profile.first_name, option.profile.last_name)}`
              }
            onChange={(_, profile) => {
              setSelectedProfile(null);
              setSearchText("");
              if (!profile) return;

              openOrCreateConversation(profile.id);
            }}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    <Avatar
                        src={option.profile.avatar_url ?? undefined}
                        sx={{ mr: 1, width: 32, height: 32, bgcolor: stringToAvatarColor(option.profile.first_name), fontSize: 12 }}
                    >
                        {!option.profile.avatar_url && getInitials(formatName(option.profile.first_name, option.profile.last_name))}
                    </Avatar>

                    {formatName(option.profile.first_name, option.profile.last_name)}
                </Box>
            )}
            
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Search people..."
                    sx={{
                      px: 1,
                      mb: 1.5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        bgcolor: "action.hover",
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
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
                {grouped.announcements.length + grouped.organization.length > 0 && grouped.direct.length > 0 && (
                  <Divider sx={{ my: 1 }} />
                )}
                {grouped.direct.map(renderConversationRow)}

                {grouped.announcements.length === 0 &&
                  grouped.organization.length === 0 &&
                  grouped.direct.length === 0 && (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6, opacity: 0.45 }}>
                      <PersonIcon sx={{ fontSize: 38, mb: 1 }} />
                      <Typography variant="body2">No conversations found</Typography>
                    </Box>
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
              gap: 1,
              px: 1,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <IconButton
              size="small"
              title="Back"
              onClick={backToList}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            <Avatar
              src={activeConversation.type === "direct" ? activeConversation.other_participant?.profile.avatar_url ?? undefined : undefined}
              sx={{
                width: 32,
                height: 32,
                fontSize: 12,
                bgcolor:
                  activeConversation.type === "announcement"
                    ? "warning.main"
                    : activeConversation.type === "organization"
                    ? "info.main"
                    : stringToAvatarColor(getDisplayName(activeConversation)),
              }}
            >
              {activeConversation.type === "announcement" ? (
                <CampaignIcon fontSize="small" />
              ) : activeConversation.type === "organization" ? (
                <BusinessIcon fontSize="small" />
              ) : !activeConversation.other_participant?.profile.avatar_url ? (
                getInitials(getDisplayName(activeConversation))
              ) : null}
            </Avatar>

            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {getDisplayName(activeConversation)}
            </Typography>
          </Box>

          {msgError && (
            <Box sx={{ px: 1, my: 1 }}>
              <ErrorAlert message={msgError} />
            </Box>
          )}
          
          <Box sx={{ flex: 1, overflowY: "auto", bgcolor: (theme) => alpha(theme.palette.text.primary, 0.015), px: 0.5 }}>
            <Box
              sx={{
                height: 330,
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
                const isEditing = editingId === message.id;
                const isOwn = message.sender.id === memberId;
                const canModify = canModifyMessage(message);
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
                    {isOwn && !isEditing &&(
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: isOwn ? "flex-end" : "flex-start",
                        alignItems: "center",
                        gap: 0.5,
                        mr: 1,
                        opacity: hoveredMessageId === message.id ? 1 : 0,
                        transition: "opacity 0.15s ease",
                      }}
                    >
                      <Typography sx={{ fontSize: '0.72rem', opacity: 0.5, whiteSpace: "nowrap" }}>
                        {new Date(message.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.edited_at ? " (edited)" : ""}
                      </Typography> 

                      <>
                        {now - new Date(message.created_at).getTime() < 15 * 60 * 1000 && message.deleted_at === null && (
                          <IconButton
                            size="small"
                            sx={{ p: "3px", "&:hover": { bgcolor: "action.hover" } }}
                            onClick={() => startEdit(message)}
                          >
                            <EditIcon sx={{ fontSize: '0.85rem' }} />
                          </IconButton>
                        )}
                        {isOwn && !isEditing && canModify && !message.deleted_at &&(
                        <IconButton
                          size="small"
                          disabled={deletingId === message.id}
                          sx={{
                            p: "3px",
                            "&:hover": {
                              bgcolor: "action.hover",
                              color: "error.main",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDelete(message);
                          }}
                        >
                          {deletingId === message.id ? (
                            <CircularProgress size={14} />
                          ) : (
                            <DeleteIcon sx={{ fontSize: "0.85rem" }} />
                          )}
                        </IconButton>
                        )}
                      </>
                    </Box>
                    )}
                    <Box 
                     
                      sx={{ maxWidth: "70%" }}>

                      <Box sx={{display: 'flex', justifySelf: isOwn ?'end' : 'start', alignItems: 'flex-end'}}>
                        {!isOwn && (
                        <Avatar
                          title={formatName(message.sender.profile.first_name, message.sender.profile.last_name)}
                          sx={{
                            cursor: 'pointer',
                            height: 28,
                            width: 28,
                            mr: 0.75,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: stringToAvatarColor(formatName(message.sender.profile.first_name, message.sender.profile.last_name)),
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(formatName(message.sender.profile.first_name, message.sender.profile.last_name))}
                        </Avatar>
                        )}
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1.5,
                            py: 0.75,
                            display: 'flex',
                            borderRadius: 3,
                            ...(isOwn
                              ? { borderBottomRightRadius: 4 }
                              : { borderBottomLeftRadius: 4 }),
                            flexDirection: 'column',
                            justifySelf: isOwn ?'end' : 'start',
                            width: "fit-content",
                            minWidth: 30,
                            maxWidth: 270,
                            wordBreak: "break-word",
                            bgcolor: isOwn ? "primary.main" : "background.paper",
                            color: isOwn ? "primary.contrastText" : "text.primary",
                            border: isOwn ? "none" : "1px solid",
                            borderColor: "divider",
                            boxShadow: isOwn ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
                          }}
                        >
                          {isEditing ? (
                            <Box sx={{maxWidth: '100%', display: "flex", flexDirection: 'column', alignItems: "center", backgroundColor: '#e2e2e200' }}>
                              <TextField
                                size="small"
                                variant="standard"
                                disabled={savingEdit}
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
                                <IconButton
                                  sx={{ p: "3px" }}
                                  disabled={savingEdit}
                                  onClick={saveEdit}
                                >
                                  {savingEdit ? (
                                    <CircularProgress size={14} sx={{ color: "white" }} />
                                  ) : (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "0.85rem",
                                        color: "white",
                                      }}
                                    />
                                  )}
                                </IconButton>
                                <IconButton
                                  sx={{ p: "3px" }}
                                  disabled={savingEdit}
                                  onClick={cancelEdit}
                                >
                                  <CloseIcon
                                    sx={{
                                      fontSize: "0.85rem",
                                      color: "white",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                            </Box>
                          ) : (

                            <Typography sx={{ fontSize: "0.85rem", whiteSpace: "pre-wrap", opacity: message.deleted_at ? 0.6 : 1, fontStyle: message.deleted_at ? "italic" : "normal",  }}>
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
                              elevation={0} 
                              sx={{
                              display: 'flex',
                              width: "fit-content",
                              maxWidth: "100%", 
                              alignItems: 'center',
                              justifyContent: 'start', 
                              bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, isOwn ? 0.12 : 0.045),
                              color: isOwn ? "primary.contrastText" : "text.primary",
                              mt: 1,  
                              borderRadius: 2, 
                              p: 1, 
                              cursor:'pointer', 
                              "&:hover": { bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, isOwn ? 0.2 : 0.08) }
                            }}>
                            <Box sx={{ height: 34, width: 34, borderRadius: "50%", bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.08), mr: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                              <PersonIcon sx={{ fontSize: '18px'}}/>
                            </Box>
                            <Box 
                            sx={{
                              flex: "none",
                              minWidth: 0,
                            }}>
                              <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, opacity: 0.7, letterSpacing: 0.3 }}>
                              {message.entity_type.toUpperCase()}
                              </Typography>
                              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "pre-line", mt: "1px" }}>
                              {getValue(message.entity_type, message.entity_id)}
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
                        alignSelf: "center",
                        opacity: hoveredMessageId === message.id ? 1 : 0,
                        transition: "opacity 0.15s ease",
                      }}
                    >
                      <Box sx={{display: 'flex', alignItems: 'center',}}>
                        <Typography sx={{ fontSize: "0.72rem", opacity: 0.5, whiteSpace: "nowrap", }}>
                          {new Date(message.created_at).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {message.edited_at ? " (edited)" : ""}
                        </Typography>
                      </Box> 
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
          <Box sx={{ mt: 1, mb: 0.5, textAlign: 'center', fontSize: '0.8rem', color: 'text.secondary', py: 1 }}>
              Only Owner / Managers can add message here
          </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, p: 0.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "action.hover", borderRadius: 999, pl: 0.5 }}>
              <FormControl size="small">
                <Select
                  value={entityType}
                  onChange={(e) => {
                    setEntityType(e.target.value as EntityChoice);
                    setEntityId("");
                  }}
                  sx={{
                    width: 100,
                    "& .MuiInputBase-input": { py: "5px", fontSize: '0.8rem', fontWeight: 700, pl: "10px" },
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
                            <span style={{ color: "#999", fontSize: '0.8rem' }}>Choose {entityType}</span>
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
                      "& .MuiInputBase-input": { py: "5px", fontSize: '0.8rem', pl: "2px" },
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  bgcolor: "action.hover",
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiInputBase-input": { fontSize: "0.85rem", py: "8px" },
              }}
            />

            <Tooltip title="Send">
              <span>
                <IconButton
                  color="primary"
                  disabled={!canSend}
                  onClick={handleSend}
                  sx={{
                    bgcolor: canSend ? "primary.main" : "action.hover",
                    color: canSend ? "primary.contrastText" : "text.disabled",
                    "&:hover": { bgcolor: canSend ? "primary.dark" : "action.hover" },
                    "&.Mui-disabled": { color: "text.disabled" },
                  }}
                >
                  {sending ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : <SendIcon fontSize="small" />}
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
            disabled={deletingId === selectedMessage?.id}
            onClick={() => {
              if (!selectedMessage) return;
              removeMessage(selectedMessage.id);
            }}
          >
            {deletingId === selectedMessage?.id ? "Deleting" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
</Box>
  );
}
