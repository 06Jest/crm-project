import { useState, useMemo, useEffect, type ReactNode } from "react";
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
} from "@mui/material";

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
  key: "all" | EmailStatus;
  label: string;
  icon: ReactNode;
}[] = [
  { key: "all", label: "All Mail", icon: <AllInboxIcon fontSize="small" /> },
  { key: "draft", label: "Drafts", icon: <DraftsIcon fontSize="small" /> },
  { key: "queued", label: "Queue", icon: <ScheduleIcon fontSize="small" /> },
  { key: "sent", label: "Sent", icon: <MarkEmailReadIcon fontSize="small" /> },
  { key: "failed", label: "Failed", icon: <ErrorOutlineIcon fontSize="small" /> },
];

// Extends the textStyle mark with a `fontSize` attribute so the toolbar's
// font-size dropdown can apply/clear an inline style, same way Color and
// FontFamily add their own attributes to the same mark.
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

function StatusIcon({ status }: { status: EmailStatus }) {
  const sx = { fontSize: 13, opacity: 0.8, color: STATUS_META[status].color };
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
    p: "4px",
    color: active ? "primary.main" : "text.primary",
    opacity: active ? 1 : 0.6,
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
    width: 26,
    height: 26,
    borderRadius: "4px",
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
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.25, py: 0.25 }}>
      <TextField
        select
        size="small"
        value={editor.getAttributes("textStyle").fontFamily ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) editor.chain().focus().unsetFontFamily().run();
          else editor.chain().focus().setFontFamily(value).run();
        }}
        sx={{ width: 80, ...selectSx }}
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
        sx={{ width: 65, ...selectSx }}
      >
        {FONT_SIZES.map((size) => (
          <MenuItem key={size || "default"} value={size} sx={{ fontSize: 12 }}>
            {size || "Default"}
          </MenuItem>
        ))}
      </TextField>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "4px" }} />

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

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "4px" }} />

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

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "4px" }} />

      <FormControl size="small" sx={{ minWidth: 40 }}>
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

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "4px" }} />

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

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "4px" }} />

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

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: "4px" }} />

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
    </Box>
  );
}

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
  const [statusFilter, setStatusFilter] = useState<"all" | EmailStatus>("all");
  const [ownerType, setOwnerType] = useState<EmailOwnerType>("lead");
  const [ownerId, setOwnerId] = useState("");
  const [recipientAutoFilled, setRecipientAutoFilled] = useState(false);

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

  useEffect(() => {
    if (!editor || view !== "editor") return;

    editor.commands.setContent(activeEmail?.body_html ?? "");
    editor.setEditable(isDraft);
    setEditBodyHtml(activeEmail?.body_html ?? "");
    setEditBodyText(activeEmail?.body_text ?? "");
  }, [editor, view, activeId]);

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

  const resetEditorState = () => {
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
    setActiveId(null);
    setEditRecipient("");
    setEditSubject("");
    setOwnerType("lead");
    setOwnerId("");
    setRecipientAutoFilled(false);
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

  const removeEmail = async (email: EmailListItem, e?: React.MouseEvent) => {
    e?.stopPropagation();

    try {
      await dispatch(deleteEmail(email.id)).unwrap();
    } catch {
      return; // error in state
    }

    if (activeId === email.id) {
      setView("list");
      setActiveId(null);
      resetEditorState();
    }
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

  const buildComposePayload = () => ({
    recipient_email: editRecipient.trim(),
    subject: editSubject.trim(),
    body_text: editBodyText.trim(),
    body_html: editBodyHtml,
    lead_id: ownerType === "lead" ? ownerId : undefined,
    contact_id: ownerType === "contact" ? ownerId : undefined,
    customer_id: ownerType === "customer" ? ownerId : undefined,
  });

  const buildUpdatePayload = () => ({
    recipient_email: editRecipient.trim(),
    subject: editSubject.trim(),
    body_text: editBodyText.trim(),
    body_html: editBodyHtml,
  });

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

  const handleSend = async () => {
    if (!canSave) return;

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
    }
  };

  const getValue = (type: EmailOwnerType, id: string | null) => {
    if (!id) return "";

    if (type === "contact") {
      const value = contactsMap.get(id);
      return value ? formatName(value.first_name, value.last_name) : "";
    }

    if (type === "lead") {
      const value = leadsMap.get(id);
      return value ? formatName(value.first_name, value.last_name) : "";
    }

    if (type === "customer") {
      const customer = customersMap.get(id);
      if (!customer) return "";
      const contact = contactsMap.get(customer.contact_id);
      return contact ? formatName(contact.first_name, contact.last_name) : "";
    }
    return "";
  };

  const ownerOf = (email: EmailListItem): { type: EmailOwnerType | null; id: string | null } => {
    if (email.lead_id) return { type: "lead", id: email.lead_id };
    if (email.contact_id) return { type: "contact", id: email.contact_id };
    if (email.customer_id) return { type: "customer", id: email.customer_id };
    return { type: null, id: null };
  };

  const statusCounts = useMemo(() => {
    const counts: Record<"all" | EmailStatus, number> = {
      all: emails.length,
      draft: 0,
      queued: 0,
      sent: 0,
      failed: 0,
    };
    emails.forEach((e) => {
      counts[e.status] = (counts[e.status] ?? 0) + 1;
    });
    return counts;
  }, [emails]);

  const visibleEmails = useMemo(() => {
    const search = query.trim().replace(/\s+/g, " ").toLowerCase();

    return emails
      .filter((email) => {
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

        const matchesStatus = statusFilter === "all" || email.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [emails, query, statusFilter]);

  const leaveEditor = async () => {
    if (view !== "editor") return;

    if (activeEmail?.status !== "draft") {
      setView("list");
      setActiveId(null);
      resetEditorState();
      return;
    }

    const hasContent =
      editRecipient.trim() ||
      editSubject.trim() ||
      editBodyText.trim();

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
        } else if (ownerId) {
          await dispatch(addEmailDraft(buildComposePayload())).unwrap();
        }
      } catch {
        // optional
      } finally {
        setSaving(false);
      }
    }

    setView("list");
    setActiveId(null);
    resetEditorState();
  };

  return (
    <Box sx={{ display: "flex", height: "100%", minHeight: 0 }}>
      <Box
        sx={{
          width: 168,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "#63636322",
          pr: 1,
          pt: 0.5,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          disableElevation
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => {
            dispatch(clearError());
            openNewEmail();
          }}
          sx={{
            borderRadius: 6,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            py: 0.8,
            mb: 1.5,
            boxShadow: 1,
          }}
        >
          Compose
        </Button>

        <List dense disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
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
                  py: 0.6,
                  borderRadius: "0 16px 16px 0",
                  bgcolor: active ? "action.selected" : "transparent",
                  color: active ? "primary.main" : "text.primary",
                  "&:hover": { bgcolor: active ? "action.selected" : "action.hover" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1.25 }}>
                  <Box sx={{ display: "flex", opacity: active ? 1 : 0.7 }}>{icon}</Box>
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
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: active ? 700 : 500,
                        opacity: 0.6,
                        minWidth: 16,
                        textAlign: "right",
                      }}
                    >
                      {statusCounts[key]}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", pl: 1.5 }}>
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
                  <IconButton size="small" onClick={refresh} disabled={eL}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <TextField
                size="small"
                fullWidth
                placeholder="Search emails..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  bgcolor: "action.hover",
                  borderRadius: 6,
                  "& .MuiOutlinedInput-root": { borderRadius: 6 },
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, opacity: 0.6, textTransform: "uppercase", pl: 0.5 }}>
                  {SIDEBAR_ITEMS.find((s) => s.key === statusFilter)?.label ?? "All Mail"}
                </Typography>
              </Box>

              {eL && !eLd ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress size={22} />
                </Box>
              ) : visibleEmails.length === 0 ? (
                <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", mt: 4 }}>
                  {emails.length === 0 ? "No emails yet" : "No matches found"}
                </Typography>
              ) : (
                <List sx={{ overflowY: "auto", height: 325 }} dense disablePadding>
                  {visibleEmails.map((email) => {
                    const owner = ownerOf(email);

                    return (
                      <ListItem
                        key={email.id}
                        disableGutters
                        onClick={() => openExistingEmail(email)}
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
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <StatusIcon status={email.status} />
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
                                  {email.subject || "(No subject)"}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mr: 1 }}>
                                <IconButton sx={{ p: "2px" }} onClick={(e) => removeEmail(email, e)}>
                                  <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                                </IconButton>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Box sx={{ display: "flex" }}>
                                <Typography variant="caption" fontSize="0.7rem" sx={{ ml: 1 }}>
                                  {email.recipient_email}
                                </Typography>
                                {owner.type && getValue(owner.type, owner.id) && (
                                  <Typography variant="caption" fontSize="0.7rem" sx={{ ml: 1, opacity: 0.7 }}>
                                    • {getValue(owner.type, owner.id)}
                                  </Typography>
                                )}
                              </Box>
                              <Typography variant="caption" fontSize="0.7rem" sx={{ color: STATUS_META[email.status].color }}>
                                {new Date(email.updated_at).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "start" }}>
                  <IconButton
                    title="Back"
                    size="small"
                    onClick={async () => {
                      await leaveEditor();
                      dispatch(clearError());
                    }}
                    disabled={saving}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ ml: 1, opacity: 0.6 }}>
                    {activeEmail
                      ? `${STATUS_META[activeEmail.status].label} • ${new Date(activeEmail.created_at).toLocaleString()}`
                      : "New Email"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {saving && <CircularProgress size={14} sx={{ mr: 1 }} />}

                  {isDraft && (
                    <IconButton title="Save Draft" size="small" disabled={!canSave || saving} onClick={saveAndExit}>
                      <CheckIcon fontSize="small" />
                    </IconButton>
                  )}

                  {activeEmail && (
                    <IconButton size="small" onClick={(e) => removeEmail(activeEmail, e)} disabled={saving}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>

            {activeEmail?.status === "failed" && activeEmail.error_message && (
              <Box sx={{ width: "100%", mb: 1 }}>
                <ErrorAlert message={activeEmail.error_message} />
              </Box>
            )}

            {isDraft && (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ width: 100 }}>
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
                        "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                    >
                      <MenuItem value="lead">Leads</MenuItem>
                      <MenuItem value="contact">Contacts</MenuItem>
                      <MenuItem value="customer">Customers</MenuItem>
                    </TextField>
                  </Box>

                  <Box sx={{ width: 220 }}>
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
                        "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
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
                  placeholder="To (recipient email)"
                  value={editRecipient}
                  onChange={(e) => {
                    setEditRecipient(e.target.value);
                    setRecipientAutoFilled(false);
                  }}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiInputBase-input": { py: "3px", fontSize: 13 },
                  }}
                />

                <Divider />

                <TextField
                  size="small"
                  fullWidth
                  placeholder="Subject"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiInputBase-input": { py: "3px", fontSize: 13, fontWeight: 700 },
                  }}
                />

                <Divider />

                <EditorToolbar editor={editor} />

                <Divider sx={{ mb: 1 }} />

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
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

                <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<SendIcon fontSize="small" />}
                    disabled={!canSave || saving}
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </Box>
              </>
            )}

            {!isDraft && activeEmail && (
              <Box sx={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", py: 2 }}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "#63636322",
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1 }}>
                      {activeEmail.subject || "(No subject)"}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", opacity: 0.7 }}>
                      From: {activeEmail.sender_name} &lt;{activeEmail.sender_email}&gt;
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", opacity: 0.7 }}>
                      To: {activeEmail.recipient_email}
                    </Typography>
                    {activeEmail.sent_at && (
                      <Typography variant="caption" sx={{ display: "block", opacity: 0.5, mt: 0.5 }}>
                        {new Date(activeEmail.sent_at).toLocaleString()}
                      </Typography>
                    )}
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
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}