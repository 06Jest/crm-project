import { useState, useMemo, useEffect, type ReactNode, useRef, useCallback } from "react";
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
  CircularProgress,
  Tooltip,
  Button,
  MenuItem,
  FormControl,
  Select,
  Avatar,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AllInboxIcon from "@mui/icons-material/AllInbox";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import SubjectIcon from "@mui/icons-material/Subject";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CodeIcon from "@mui/icons-material/Code";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";

import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmails,
  addEmailDraft,
  updateEmailDraft,
  sendEmail,
  deleteEmail,
  clearError,
} from "../../store/emailSlice";
import type { EmailListItem, EmailStatus, EmailOwnerType } from "../../types/email";
import ErrorAlert from "../Error";
import { fetchContactsLists } from "../../store/contactsSlice";
import { fetchLeadsLists } from "../../store/leadsSlice";
import { fetchCustomersLists } from "../../store/customersSlice";
import { formatName } from "../../utils/formatText";

const STATUS_META: Record<EmailStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "text.secondary" },
  queued: { label: "Queued", color: "warning.main" },
  sent: { label: "Sent", color: "success.main" },
  failed: { label: "Failed", color: "error.main" },
};

const SIDEBAR_ITEMS: {
  key: "all" | EmailStatus | "trash";
  label: string;
  icon: ReactNode;
}[] = [
  { key: "all", label: "All Mail", icon: <AllInboxIcon fontSize="small" /> },
  { key: "draft", label: "Drafts", icon: <DraftsIcon fontSize="small" /> },
  { key: "queued", label: "Queue", icon: <ScheduleIcon fontSize="small" /> },
  { key: "sent", label: "Sent", icon: <MarkEmailReadIcon fontSize="small" /> },
  { key: "failed", label: "Failed", icon: <ErrorOutlineIcon fontSize="small" /> },
  { key: "trash", label: "Trash", icon: <DeleteOutlineIcon fontSize="small" /> },
];


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

function getInitials(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "?";
  const namePart = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
  const parts = namePart.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function stringToAvatarColor(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = input.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

  
function statusThemeColor(theme: Theme, status: EmailStatus) {
  switch (status) {
    case "queued":
      return theme.palette.warning.main;
    case "sent":
      return theme.palette.success.main;
    case "failed":
      return theme.palette.error.main;
    default:
      return theme.palette.text.secondary;
  }
}

const statusChipSx = (status: EmailStatus): SxProps<Theme> => ({
  height: 22,
  fontSize: 11,
  fontWeight: 700,
  color: (theme) => statusThemeColor(theme, status),
  bgcolor: (theme) => alpha(statusThemeColor(theme, status), 0.12),
  border: "1px solid",
  borderColor: (theme) => alpha(statusThemeColor(theme, status), 0.25),
});

function StatusIcon({ status, size = 13 }: { status: EmailStatus; size?: number }) {
  const sx = { fontSize: size, opacity: 0.9, color: STATUS_META[status].color };
  switch (status) {
    case "queued":
      return <ScheduleIcon sx={sx} />;
    case "sent":
      return <MarkEmailReadIcon sx={sx} />;
    case "failed":
      return <ErrorOutlineIcon sx={sx} />;
    default:
      return <DraftsIcon sx={sx} />;
  }
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btnSx = (active: boolean) => ({
    p: "5px",
    borderRadius: 1.5,
    color: active ? "primary.main" : "text.primary",
    bgcolor: active ? (theme: Theme) => alpha(theme.palette.primary.main, 0.12) : "transparent",
    opacity: active ? 1 : 0.65,
    "&:hover": { opacity: 1, bgcolor: active ? undefined : "action.hover" },
  });

  const selectSx = {
    "& .MuiInputBase-input": { py: "3px", px: "6px", fontSize: 11, fontWeight: 600 },
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
  };

  const swatchSx = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: "6px",
    cursor: "pointer",
    opacity: 0.75,
    "&:hover": { opacity: 1, bgcolor: "action.hover" },
  };

  const colorInputSx = {
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    border: "none",
    padding: 0,
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const currentColor = (editor.getAttributes("textStyle").color as string) || "#000000";
  const currentHighlight = (editor.getAttributes("highlight").color as string) || "#ffff00";

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.25,
        p: 0.5,
        borderRadius: 2.5,
        bgcolor: "action.hover",
        borderColor: "divider",
      }}
    >
      <TextField
        select
        size="small"
        value={editor.getAttributes("textStyle").fontFamily ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) editor.chain().focus().unsetFontFamily().run();
          else editor.chain().focus().setFontFamily(value).run();
        }}
        sx={{ width: 84, bgcolor: "background.paper", borderRadius: 1.5, ...selectSx }}
      >
        {FONT_FAMILIES.map((f) => (
          <MenuItem key={f.label} value={f.value} sx={{ fontSize: 12 }}>
            {f.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={(editor.getAttributes("textStyle").fontSize as string) ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          editor.chain().focus().setMark("textStyle", { fontSize: value || null }).run();
        }}
        sx={{ width: 68, bgcolor: "background.paper", borderRadius: 1.5, ...selectSx }}
      >
        {FONT_SIZES.map((size) => (
          <MenuItem key={size || "default"} value={size} sx={{ fontSize: 12 }}>
            {size || "Default"}
          </MenuItem>
        ))}
      </TextField>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "6px" }} />

      <IconButton
        size="small"
        sx={btnSx(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive("underline"))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FormatUnderlinedIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive("code"))}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive("subscript"))}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <SubscriptIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive("superscript"))}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <SuperscriptIcon fontSize="small" />
      </IconButton>
      <Tooltip title="Clear formatting">
        <IconButton
          size="small"
          sx={btnSx(false)}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <FormatClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "6px" }} />

      <Tooltip title="Text color">
        <Box component="label" sx={swatchSx}>
          <FormatColorTextIcon fontSize="small" sx={{ pointerEvents: "none" }} />
          <input
            type="color"
            value={currentColor}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            style={colorInputSx}
          />
        </Box>
      </Tooltip>

      <Tooltip title="Highlight">
        <IconButton
          size="small"
          sx={btnSx(editor.isActive("highlight"))}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <HighlightIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Background color">
        <Box component="label" sx={swatchSx}>
          <FormatColorFillIcon fontSize="small" sx={{ pointerEvents: "none" }} />
          <input
            type="color"
            value={currentHighlight}
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            style={colorInputSx}
          />
        </Box>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "6px" }} />

      <FormControl size="small" sx={{ minWidth: 44 }}>
        <Select
          displayEmpty
          value={
            HEADING_LEVELS.find((level) => editor.isActive("heading", { level })) ??
            "paragraph"
          }
          onChange={(e) => {
            const value = e.target.value;

            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })
                .run();
            }
          }}
          sx={{
            fontSize: 12,
            bgcolor: "background.paper",
            borderRadius: 1.5,
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        >
          {HEADING_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              H{level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "6px" }} />

      <IconButton
        size="small"
        sx={btnSx(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulletedIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumberedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" sx={btnSx(editor.isActive("link"))} onClick={setLink}>
        <LinkIcon fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "6px" }} />

      <IconButton
        size="small"
        sx={btnSx(editor.isActive({ textAlign: "left" }))}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <FormatAlignLeftIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive({ textAlign: "center" }))}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <FormatAlignCenterIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive({ textAlign: "right" }))}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <FormatAlignRightIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(editor.isActive({ textAlign: "justify" }))}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <FormatAlignJustifyIcon fontSize="small" />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "6px" }} />

      <IconButton
        size="small"
        sx={btnSx(false)}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <UndoIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        sx={btnSx(false)}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <RedoIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: { fontSize?: string | null }) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
];

const FONT_SIZES = ["", "10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"];

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export default function EmailPanel() {
  const dispatch = useDispatch<AppDispatch>();

  const { items: emails, loading: eL, loaded: eLd, error } = useSelector(
    (state: RootState) => state.emails
  );
  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loaded: lLd } = useSelector((s: RootState) => s.leads);
  const { items: customers, loaded: cuLd } = useSelector((s: RootState) => s.customers);

  const contactsMap = useMemo(() => new Map(contacts.map((c) => [c.id, c])), [contacts]);
  const leadsMap = useMemo(() => new Map(leads.map((l) => [l.id, l])), [leads]);
  const customersMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "editor">("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editRecipient, setEditRecipient] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editBodyHtml, setEditBodyHtml] = useState("");
  const [editBodyText, setEditBodyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | EmailStatus | "trash">("all");
  const [ownerType, setOwnerType] = useState<EmailOwnerType>("lead");
  const [ownerId, setOwnerId] = useState("");
  const [recipientAutoFilled, setRecipientAutoFilled] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmailListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const activeEmail = emails.find((e) => e.id === activeId) ?? null;
  const isDraft = !activeEmail || activeEmail.status === "draft";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Write your message..." }),
      FontSize,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditBodyHtml(editor.getHTML());
      setEditBodyText(editor.getText());
    },
  });
  const loadedEmail = useRef(false);

  useEffect(() => {
    if (!editor || view !== "editor") return;

    editor.commands.setContent(activeEmail?.body_html ?? "");

    loadedEmail.current = true;

    editor.setEditable(activeEmail?.status === "draft" || !activeEmail);

    setEditBodyHtml(activeEmail?.body_html ?? "");
    setEditBodyText(activeEmail?.body_text ?? "");
  }, [editor, view, activeEmail]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!eLd) await dispatch(fetchEmails()).unwrap();
        if (!cLd) await dispatch(fetchContactsLists()).unwrap();
        if (!lLd) await dispatch(fetchLeadsLists()).unwrap();
        if (!cuLd) await dispatch(fetchCustomersLists()).unwrap();
      } catch {
        // Error handled by Redux state
      }
    };
    loadData();
  }, [eLd, cLd, lLd, cuLd, dispatch]);

  const refresh = async () => {
    try {
      await dispatch(fetchEmails()).unwrap();
    } catch {
      // Error handled by Redux state
    }
  };

  const buildComposePayload = useCallback(
  () => ({
    recipient_email: editRecipient.trim(),
    subject: editSubject.trim(),
    body_html: editBodyHtml,
    body_text: editBodyText,
    lead_id: ownerType === "lead" ? ownerId || undefined : undefined,
    contact_id: ownerType === "contact" ? ownerId || undefined : undefined,
    customer_id: ownerType === "customer" ? ownerId || undefined : undefined,
  }),
  [
    editRecipient,
    editSubject,
    editBodyHtml,
    editBodyText,
    ownerType,
    ownerId,
  ]
);

const buildUpdatePayload = useCallback(
  () => ({
    recipient_email: editRecipient.trim(),
    subject: editSubject.trim(),
    body_text: editBodyText.trim(),
    body_html: editBodyHtml,
  }),
  [editRecipient, editSubject, editBodyText, editBodyHtml]
);


  const autoSaveDraft = useCallback(async () => {
  if (!loadedEmail.current) return;
  if (view !== "editor") return;
  if (isSending.current) return;

  const hasContent =
    editRecipient.trim() ||
    editSubject.trim() ||
    editBodyText.trim();

  if (!hasContent) return;
  if (isSavingDraft.current) return;

  isSavingDraft.current = true;

  try {
    if (activeId) {
      await dispatch(
        updateEmailDraft({
          id: activeId,
          email: buildUpdatePayload(),
        })
      ).unwrap();
    } else {
      const created = await dispatch(
        addEmailDraft(buildComposePayload())
      ).unwrap();

      setActiveId(created.id);
    }
  } catch {
    // Redux error state handles the error
  } finally {
    isSavingDraft.current = false;
  }
}, [
  activeId,
  dispatch,
  editRecipient,
  editSubject,
  view,
  buildComposePayload,
  buildUpdatePayload,
  editBodyText
]);

useEffect(() => {
  if (view !== "editor") return;

  const timer = setTimeout(() => {
    void autoSaveDraft();
  }, 3000);

  return () => clearTimeout(timer);
}, [autoSaveDraft, view]);

  const resetEditorState = () => {
    setActiveId(null);
    setEditRecipient("");
    setEditSubject("");
    setEditBodyHtml("");
    setEditBodyText("");
    setOwnerType("lead");
    setOwnerId("");
    setRecipientAutoFilled(false);
    editor?.commands.setContent("");
  };

  const openNewEmail = () => {
    loadedEmail.current = false;

    setActiveId(null);
    setEditRecipient("");
    setEditSubject("");
    setEditBodyHtml("");
    setEditBodyText("");
    setOwnerType("lead");
    setOwnerId("");
    setRecipientAutoFilled(false);

    editor?.commands.setContent("");

    setView("editor");
  };

  const openExistingEmail = (email: EmailListItem) => {
    setActiveId(email.id);
    setEditRecipient(email.recipient_email);
    setEditSubject(email.subject);
    setRecipientAutoFilled(false);
    if (email.lead_id) {
      setOwnerType("lead");
      setOwnerId(email.lead_id);
    } else if (email.contact_id) {
      setOwnerType("contact");
      setOwnerId(email.contact_id);
    } else if (email.customer_id) {
      setOwnerType("customer");
      setOwnerId(email.customer_id);
    }
    setView("editor");
  };

  const removeEmail = (email: EmailListItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteTarget(email);
  };

  const confirmDeleteEmail = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await dispatch(deleteEmail(deleteTarget.id)).unwrap();
    } catch {
      setDeleting(false);
      return; // error in state
    }

    if (activeId === deleteTarget.id) {
      setView("list");
      setActiveId(null);
      resetEditorState();
    }

    setDeleting(false);
    setDeleteTarget(null);
  };

  const items = useMemo(() => {
    switch (ownerType) {
      case "contact":
        return contacts.map((c) => ({
          id: c.id,
          label: `${c.first_name} ${c.last_name}`,
          email: c.email ?? "",
        }));
      case "lead":
        return leads.map((l) => ({
          id: l.id,
          label: `${l.first_name} ${l.last_name}`,
          email: l.email ?? "",
        }));
      case "customer":
        return customers.map((c) => {
          const con = contacts.find((co) => co.id === c.contact_id);
          return {
            id: c.id,
            label: con ? `${con.first_name} ${con.last_name}` : "Unknown Contact",
            email: con?.email ?? "",
          };
        });
      default:
        return [];
    }
  }, [ownerType, contacts, leads, customers]);

  const canSave =
    editRecipient.trim().length > 0 &&
    editSubject.trim().length > 0 &&
    editBodyText.trim().length > 0 &&
    (activeId !== null || ownerId.length > 0);

  

  const saveAndExit = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      if (activeId) {
        await dispatch(updateEmailDraft({ id: activeId, email: buildUpdatePayload() })).unwrap();
      } else {
        await dispatch(addEmailDraft(buildComposePayload())).unwrap();
      }
      setView("list");
      setActiveId(null);
      resetEditorState();
    } catch {
      // error in state
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEmail = async (email: EmailListItem) => {
    await leaveEditor();
    openExistingEmail(email);
  };

  const isSending = useRef(false);
  const isSavingDraft = useRef(false);

  const handleSend = async () => {
    if (!canSave) return;
    isSending.current = true;
    setSaving(true);
    try {
      let id = activeId;

      if (id) {
        await dispatch(updateEmailDraft({ id, email: buildUpdatePayload() })).unwrap();
      } else {
        const created = await dispatch(addEmailDraft(buildComposePayload())).unwrap();
        id = created.id;
      }

      await dispatch(sendEmail(id)).unwrap();

      setView("list");
      setActiveId(null);
      resetEditorState();
    } catch {
      // error in state
    } finally {
      setSaving(false);
      isSending.current = false;
    }
  };

const getValue = useCallback(
  (type: EmailOwnerType, id: string | null) => {
    if (!id) return "";

    if (type === "contact") {
      const contact = contactsMap.get(id);

      return contact
        ? formatName(contact.first_name, contact.last_name)
        : "";
    }

    if (type === "lead") {
      const lead = leadsMap.get(id);

      return lead
        ? formatName(lead.first_name, lead.last_name)
        : "";
    }

    if (type === "customer") {
      const customer = customersMap.get(id);

      if (!customer) return "";

      const contact = contactsMap.get(customer.contact_id);

      return contact
        ? formatName(contact.first_name, contact.last_name)
        : "";
    }

    return "";
  },
  [contactsMap, leadsMap, customersMap]
);

const ownerOf = (
  email: EmailListItem
): { type: EmailOwnerType | null; id: string | null } => {
  if (email.lead_id) {
    return { type: "lead", id: email.lead_id };
  }

  if (email.contact_id) {
    return { type: "contact", id: email.contact_id };
  }

  if (email.customer_id) {
    return { type: "customer", id: email.customer_id };
  }

  return { type: null, id: null };
};

  const statusCounts = useMemo(() => {
    const counts: Record<"all" | EmailStatus | "trash", number> = {
      all: 0,
      draft: 0,
      queued: 0,
      sent: 0,
      failed: 0,
      trash: 0,
    };
    emails.forEach((e) => {
      if (e.deleted_at) {
        counts.trash += 1;
        return;
      }
      counts.all += 1;
      counts[e.status] = (counts[e.status] ?? 0) + 1;
    });
    return counts;
  }, [emails]);

  const visibleEmails = useMemo(() => {
    const search = query.trim().replace(/\s+/g, " ").toLowerCase();

    return emails
      .filter((email) => {
        const isTrashed = Boolean(email.deleted_at);

        if (statusFilter === "trash") {
          if (!isTrashed) return false;
        } else if (isTrashed) {
          return false;
        }

        const updated = new Date(email.updated_at);
        const owner = ownerOf(email);

        const searchableFields = [
          email.subject,
          email.recipient_email,
          email.sender_name,
          email.status,
          email.preview_text ?? "",
          owner.type ? getValue(owner.type, owner.id) : "",
          updated.toLocaleDateString("en-US"),
          updated.toLocaleDateString("en-US", { month: "short" }),
          updated.toLocaleDateString("en-US", { month: "long" }),
          String(updated.getDate()),
          String(updated.getFullYear()),
        ];

        const matchesSearch =
          !search || searchableFields.some((field) => field.toLowerCase().includes(search));

        const matchesStatus =
          statusFilter === "all" || statusFilter === "trash" || email.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [emails, query, statusFilter, getValue]);

  const leaveEditor = async () => {
    if (view !== "editor") return;

    if (activeEmail?.status !== "draft") {
      setView("list");
      setActiveId(null);
      resetEditorState();
      return;
    }

    const hasContent =
      editRecipient.trim().length > 0 ||
      editSubject.trim().length > 0 ||
      editBodyText.trim().length > 0;

    if (hasContent) {
      setSaving(true);

      try {
        if (activeId) {
          await dispatch(
            updateEmailDraft({
              id: activeId,
              email: buildUpdatePayload(),
            })
          ).unwrap();
        } else {
          await dispatch(
            addEmailDraft(buildComposePayload())
          ).unwrap();
        }
      } finally {
        setSaving(false);
      }
}

    setView("list");
    setActiveId(null);
    resetEditorState();
  };

  // const autoSaveDraft = async () => {
  //   if (!loadedEmail.current) return;
  //   if (view !== "editor") return;
  //   if (isSending.current) return;
  //   const hasContent =
  //     editRecipient.trim() ||
  //     editSubject.trim() ||
  //     editBodyText.trim();

  //   if (!hasContent) return;

  //   if (isSavingDraft.current) return;

  //   isSavingDraft.current = true;

  //   try {
  //     if (activeId) {
  //       await dispatch(
  //         updateEmailDraft({
  //           id: activeId,
  //           email: buildUpdatePayload(),
  //         })
  //       ).unwrap();

  //     } else {
  //       const created = await dispatch(
  //         addEmailDraft(buildComposePayload())
  //       ).unwrap();

  //       setActiveId(created.id);
  //     }
  //   } finally {
  //     isSavingDraft.current = false;
  //   }
  // };

  return (
    <Box sx={{ display: "flex", height: "100%", minHeight: 0 }}>
      <Box
        sx={{
          width: 150,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
          pr: 1.5,
          pt: 0.5,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          disableElevation
          startIcon={<AddIcon fontSize="small" />}
          onClick={async () => {
            dispatch(clearError());
            await leaveEditor();
            openNewEmail();
          }}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            py: 1,
            mb: 1.5,
            boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
            "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.24)" },
          }}
        >
          Compose
        </Button>

        <List dense disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {SIDEBAR_ITEMS.map(({ key, label, icon }) => {
            const active = statusFilter === key;
            return (
              <ListItem
                key={key}
                disableGutters
                onClick={async () => {
                  await leaveEditor();
                  setStatusFilter(key);
                  
                }}
                sx={{
                  cursor: "pointer",
                  px: 1.25,
                  py: 0.7,
                  borderRadius: 999,
                  bgcolor: active ? (theme) => alpha(theme.palette.primary.main, 0.12) : "transparent",
                  color: active ? "primary.main" : "text.primary",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: active ? (theme: Theme) => alpha(theme.palette.primary.main, 0.16) : "action.hover" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1.25 }}>
                  <Box sx={{ display: "flex", opacity: active ? 1 : 0.65 }}>{icon}</Box>
                  <Typography
                    sx={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {label}
                  </Typography>
                  {statusCounts[key] > 0 && (
                    <Chip
                      label={statusCounts[key]}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        fontWeight: 700,
                        bgcolor: active ? "primary.main" : "action.selected",
                        color: active ? "primary.contrastText" : "text.secondary",
                        "& .MuiChip-label": { px: "6px" },
                      }}
                    />
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", pl: 2 }}>
        {view === "list" && (
          <>
            {error && (
              <Box sx={{ width: "100%", my: 1 }}>
                <ErrorAlert message={error} />
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  borderRadius: 999,
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <SearchIcon fontSize="small" sx={{ opacity: 0.5, mr: 1 }} />
                <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  placeholder="Search emails..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{ disableUnderline: true }}
                  sx={{ "& .MuiInputBase-input": { py: 0.9, fontSize: 13 } }}
                />
              </Paper>
              <Tooltip title="Refresh">
                <span>
                  <IconButton
                    size="small"
                    onClick={refresh}
                    disabled={eL}
                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5, mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.4, pl: 0.5 }}>
                  {SIDEBAR_ITEMS.find((s) => s.key === statusFilter)?.label ?? "All Mail"}
                </Typography>
                <Typography sx={{ fontSize: 11.5, opacity: 0.5, pr: 0.5 }}>
                  {visibleEmails.length} {visibleEmails.length === 1 ? "email" : "emails"}
                </Typography>
              </Box>
              <Divider sx={{ mb: 0.5 }} />

              {eL && !eLd ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress size={22} />
                </Box>
              ) : visibleEmails.length === 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6, opacity: 0.45 }}>
                  <AllInboxIcon sx={{ fontSize: 38, mb: 1 }} />
                  <Typography variant="body2">
                    {emails.length === 0 ? "No emails yet" : "No matches found"}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ overflowY: "auto", height: 325 }} dense disablePadding>
                  {visibleEmails.map((email) => {
                    const owner = ownerOf(email);
                    const ownerName = owner.type ? getValue(owner.type, owner.id) : "";
                    const displayName = ownerName || email.recipient_email;
                    const isTrashed = Boolean(email.deleted_at);

                    return (
                      <ListItem
                        key={email.id}
                        disableGutters
                        onClick={isTrashed ? undefined : () => handleOpenEmail(email)}
                        sx={{
                          p: 1,
                          mb: 0.5,
                          gap: 1.25,
                          alignItems: "flex-start",
                          borderRadius: 2,
                          cursor: isTrashed ? "default" : "pointer",
                          opacity: isTrashed ? 0.55 : 1,
                          transition: "background-color 0.15s ease, opacity 0.15s ease",
                          "&:hover": { bgcolor: isTrashed ? "transparent" : "action.hover" },
                          "&:hover .email-row-delete": { opacity: isTrashed ? 0 : 1 },
                        }}
                      >
                        <Box sx={{ position: "relative", flexShrink: 0, mt: 0.25 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 12.5,
                              fontWeight: 700,
                              bgcolor: stringToAvatarColor(displayName),
                            }}
                          >
                            {getInitials(displayName)}
                          </Avatar>
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: -2,
                              right: -2,
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: "background.paper",
                              border: "1px solid",
                              borderColor: "divider",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <StatusIcon status={email.status} size={10} />
                          </Box>
                        </Box>

                        <ListItemText
                          sx={{ my: 0 }}
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                              <Typography
                                noWrap
                                sx={{ fontSize: 13.5, fontWeight: 600, flex: 1, minWidth: 0 }}
                              >
                                {displayName}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0 }}>
                                {new Date(email.updated_at).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mt: "2px" }}>
                              <Typography
                                noWrap
                                sx={{ fontSize: 12.5, color: "text.secondary", flex: 1, minWidth: 0 }}
                              >
                                <Box component="span" sx={{ color: "text.primary", fontWeight: email.status === "draft" ? 500 : 600 }}>
                                  {email.subject || "(No subject)"}
                                </Box>
                                {email.preview_text ? `  ${email.preview_text}` : ""}
                              </Typography>

                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                                <Chip
                                  label={STATUS_META[email.status].label}
                                  size="small"
                                  sx={statusChipSx(email.status)}
                                />
                                <IconButton
                                  className="email-row-delete"
                                  sx={{
                                    p: "3px",
                                    opacity: 0,
                                    transition: "opacity 0.15s ease",
                                    "&:hover": { color: "error.main" },
                                  }}
                                  onClick={(e) => removeEmail(email, e)}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                                </IconButton>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
              <Box sx={{ height: 30 }}></Box>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                pb: 1.25,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <IconButton
                  title="Back"
                  size="small"
                  onClick={async () => {
                    await leaveEditor();
                    dispatch(clearError());
                  }}
                  disabled={saving}
                  sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: 14, fontWeight: 700 }}>
                    {activeEmail ? activeEmail.subject || "(No subject)" : "New Message"}
                  </Typography>
                  {activeEmail && (
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      {new Date(activeEmail.created_at).toLocaleString()}
                    </Typography>
                  )}
                </Box>
                {activeEmail && (
                  <Chip
                    icon={<StatusIcon status={activeEmail.status} size={12} />}
                    label={STATUS_META[activeEmail.status].label}
                    size="small"
                    sx={{
                      ...statusChipSx(activeEmail.status),
                      height: 22,
                      fontSize: 11,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                {saving && <CircularProgress size={14} sx={{ mr: 1 }} />}

                {isDraft && (
                  <Tooltip title="Save draft">
                    <span>
                      <IconButton
                        title="Save Draft"
                        size="small"
                        disabled={!canSave || saving}
                        onClick={saveAndExit}
                        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}

                {activeEmail && (
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => removeEmail(activeEmail, e)}
                      disabled={saving}
                      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, "&:hover": { color: "error.main" } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {activeEmail?.status === "failed" && activeEmail.error_message && (
              <Box sx={{ width: "100%", mb: 1 }}>
                <ErrorAlert message={activeEmail.error_message} />
              </Box>
            )}

            {isDraft && (
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                  borderRadius: 3,
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", px: 1.5, pt: 1.25, gap: 1 }}>
                  <Box sx={{ width: 110 }}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={ownerType}
                      disabled={activeId !== null}
                      onChange={(e) => {
                        setOwnerType(e.target.value as EmailOwnerType);
                        setOwnerId("");
                      }}
                      SelectProps={{ native: false }}
                      sx={{
                        cursor: "pointer",
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        "& .MuiInputBase-input": { py: "5px", fontSize: 11, fontWeight: 700 },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                    >
                      <MenuItem value="lead">Leads</MenuItem>
                      <MenuItem value="contact">Contacts</MenuItem>
                      <MenuItem value="customer">Customers</MenuItem>
                    </TextField>
                  </Box>

                  <Box sx={{ width: 230 }}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={ownerId}
                      disabled={activeId !== null}
                      onChange={(e) => {
                        const id = e.target.value;
                        setOwnerId(id);

                        const picked = items.find((i) => i.id === id);
                        if (picked?.email && (recipientAutoFilled || !editRecipient.trim())) {
                          setEditRecipient(picked.email);
                          setRecipientAutoFilled(true);
                        }
                      }}
                      sx={{
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        "& .MuiInputBase-input": { py: "5px", fontSize: 11, fontWeight: 700 },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected: unknown) => {
                          if (!selected) {
                            return <span style={{ color: "#999" }}>Choose a target from {ownerType}</span>;
                          }
                          const item = items.find((i) => i.id === selected);
                          return item?.label ?? "";
                        },
                        MenuProps: { PaperProps: { sx: { maxHeight: 200, overflowY: "auto" } } },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Choose a target from {ownerType}
                      </MenuItem>
                      {items.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.label}
                          {item.email ? ` (${item.email})` : " (No email yet)"}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>

                <TextField
                  size="small"
                  fullWidth
                  placeholder="recipient@email.com"
                  value={editRecipient}
                  onChange={(e) => {
                    setEditRecipient(e.target.value);
                    setRecipientAutoFilled(false);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700, width: 34 }}>
                          To
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mt: 1.25,
                    px: 1.5,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiInputBase-input": { py: "6px", fontSize: 13 },
                  }}
                />

                <Divider />

                <TextField
                  size="small"
                  fullWidth
                  placeholder="Subject"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700, width: 34 }}>
                          Subj
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    px: 1.5,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiInputBase-input": { py: "6px", fontSize: 13, fontWeight: 700 },
                  }}
                />

                <Divider />

                <Box sx={{ px: 1.25, py: 1 }}>
                  <EditorToolbar editor={editor} />
                </Box>

                <Divider />

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 2,
                    py: 1.5,
                    "& .ProseMirror": {
                      outline: "none",
                      minHeight: "100%",
                      fontSize: 13,
                    },
                    "& .ProseMirror p": { margin: "0 0 8px" },
                    "& .ProseMirror ul, & .ProseMirror ol": { pl: 2.5 },
                    "& .ProseMirror a": { color: "primary.main" },
                    "& .ProseMirror h1": { fontSize: 22, fontWeight: 700, margin: "12px 0 8px" },
                    "& .ProseMirror h2": { fontSize: 20, fontWeight: 700, margin: "10px 0 6px" },
                    "& .ProseMirror h3": { fontSize: 18, fontWeight: 700, margin: "8px 0 6px" },
                    "& .ProseMirror h4": { fontSize: 16, fontWeight: 700, margin: "6px 0 4px" },
                    "& .ProseMirror h5": { fontSize: 14, fontWeight: 700, margin: "6px 0 4px" },
                    "& .ProseMirror h6": { fontSize: 13, fontWeight: 700, margin: "6px 0 4px" },
                    "& .ProseMirror code": {
                      bgcolor: "action.hover",
                      px: "3px",
                      borderRadius: "3px",
                      fontFamily: "monospace",
                      fontSize: "0.85em",
                    },
                    "& .ProseMirror mark": { borderRadius: "2px", px: "1px" },
                    "& .ProseMirror p.is-editor-empty:first-of-type::before": {
                      content: "attr(data-placeholder)",
                      color: "#999",
                      float: "left",
                      height: 0,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <EditorContent editor={editor} />
                </Box>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", px: 1.5, py: 1.25 }}>
                  <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    startIcon={<SendIcon fontSize="small" />}
                    disabled={!canSave || saving}
                    onClick={handleSend}
                    sx={{
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 700,
                      px: 2.5,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Paper>
            )}

            {!isDraft && activeEmail && (
              <Box sx={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", py: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    width: "100%",
                    maxWidth: 540,
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>
                        {activeEmail.subject || "(No subject)"}
                      </Typography>
                      <Chip
                        icon={<StatusIcon status={activeEmail.status} size={12} />}
                        label={STATUS_META[activeEmail.status].label}
                        size="small"
                        sx={{
                          ...statusChipSx(activeEmail.status),
                          height: 22,
                          fontSize: 11,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: 13,
                          fontWeight: 700,
                          bgcolor: stringToAvatarColor(activeEmail.sender_email),
                        }}
                      >
                        {getInitials(activeEmail.sender_name || activeEmail.sender_email)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }}>
                          {activeEmail.sender_name} <Box component="span" sx={{ fontWeight: 400, opacity: 0.6 }}>&lt;{activeEmail.sender_email}&gt;</Box>
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", opacity: 0.7 }}>
                          to {activeEmail.recipient_email}
                        </Typography>
                        {activeEmail.sent_at && (
                          <Typography variant="caption" sx={{ display: "block", opacity: 0.5, mt: 0.25 }}>
                            {new Date(activeEmail.sent_at).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      fontSize: 14,
                      lineHeight: 1.6,
                      "& p": { margin: "0 0 12px" },
                      "& a": { color: "primary.main" },
                      "& ul, & ol": { pl: 2.5 },
                      "& code": {
                        bgcolor: "action.hover",
                        px: "3px",
                        borderRadius: "3px",
                        fontFamily: "monospace",
                        fontSize: "0.85em",
                      },
                      "& mark": { borderRadius: "2px", px: "1px" },
                    }}
                    dangerouslySetInnerHTML={{ __html: activeEmail.body_html || "" }}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        )}
        <Dialog
          open={Boolean(deleteTarget)}
          onClose={() => (deleting ? null : setDeleteTarget(null))}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontSize: 16, fontWeight: 700, pb: 1 }}>
            Delete this email?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: 13.5 }}>
              {deleteTarget?.subject ? (
                <>
                  "<Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>{deleteTarget.subject}</Box>" will be permanently removed. This action cannot be undone.
                </>
              ) : (
                "This email will be permanently removed. This action cannot be undone."
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999 }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteEmail}
              disabled={deleting}
              variant="contained"
              color="error"
              disableElevation
              startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : <DeleteOutlineIcon fontSize="small" />}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}