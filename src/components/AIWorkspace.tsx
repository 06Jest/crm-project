import { useDispatch, useSelector } from "react-redux";

import {
  clearConversation,
  clearAIError,
  clearConfirmation,
  setAgentId,
  sendAIChat,
  sendPublicAIChat,
  confirmAIAction,
  loadAIConversations,
  loadAIConversation,
} from "../store/aiSlice";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import SendIcon from '@mui/icons-material/Send';
import { useTheme, useMediaQuery } from "@mui/material";
import type { RootState, AppDispatch } from "../store/store";
import type { AIAgentId } from "../types/ai";
import { useAuth } from "../hooks/useAuth";
import {
  closeAIWorkspace,
  openAIWorkspace,
} from "../store/uiSlice";

const AGENTS: {
  id: AIAgentId;
  name: string;
  description: string;
}[] = [
  {
    id: "personal-assistant",
    name: "John",
    description: "Your personal assistant",
  },
  {
    id: "organization-assistant",
    name: "Jane",
    description: "Your organization assistant",
  },
  {
    id: "crm-assistant",
    name: "uniThread AI",
    description: "Your uniThread knowledge assistant",
  },
];

const SUGGESTED_PROMPTS: Record<AIAgentId, string[]> = {
  "personal-assistant": [
    "What tasks do I have?",
    "Create a note for me",
    "Help me organize my priorities",
  ],
  "organization-assistant": [
    "Show me our recent leads",
    "What contacts do we have?",
    "Give me an overview of our CRM",
  ],
  "crm-assistant": [
    "What is uniThread CRM?",
    "What features does uniThread offer?",
    "How can I use uniThread to manage leads?",
  ],
};

type ConfirmationArguments = Record<string, unknown>;

const formatConfirmationLabel = (key: string): string => {
  const labels: Record<string, string> = {
    title: "Title",
    description: "Description",
    content: "Content",
    body: "Details",
    note: "Note",
    dueDate: "Due date",
    due_date: "Due date",
    priority: "Priority",
    contactId: "Contact",
    contact_id: "Contact",
    leadId: "Lead",
    lead_id: "Lead",
    dealId: "Deal",
    deal_id: "Deal",
    customerId: "Customer",
    customer_id: "Customer",
  };

  if (labels[key]) {
    return labels[key];
  }

  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatConfirmationValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.map(formatConfirmationValue).join(", ");
  }

  if (typeof value === "object") {
    return "Additional details provided";
  }

  return String(value);
};

const getConfirmationActionLabel = (toolName: string): string => {
  const labels: Record<string, string> = {
    create_note: "Create note",
    create_task: "Create task",
    update_task: "Update task",
    update_note: "Update note",
    delete_task: "Delete task",
    delete_note: "Delete note",
  };

  return (
    labels[toolName] ??
    toolName
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  );
};

const formatConfirmationDate = (value: unknown): string => {
  if (typeof value !== "string") {
    return formatConfirmationValue(value);
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


export default function AIWorkspace() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    mode,
    messages,
    agentId,
    conversationId,
    loading,
    conversations,
    conversationsLoading,
    conversationLoading,
    error,
    confirmation,
    sources,
  } = useSelector((state: RootState) => state.ai);

  useEffect(() => {
    if (mode === "authenticated" && user) {
      dispatch(loadAIConversations());
    }
  }, [dispatch, mode, user]);

  const isOpen = useSelector(
    (state: RootState) => state.ui.isAIWorkspaceOpen
  );

  const isDarkMode = theme.palette.mode === "dark";

  const glassBackground = isDarkMode
    ? "rgba(24, 24, 28, 0.35)"
    : "rgba(246, 239, 234, 0.35)";

  const glassSurface = isDarkMode
    ? "rgba(255, 255, 255, 0.025)"
    : "rgba(255, 255, 255, 0.25)";

  const glassSurfaceStrong = isDarkMode
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(255, 255, 255, 0.20)";

  const glassBorder = isDarkMode
    ? "rgba(255, 255, 255, 0.13)"
    : "rgba(120, 85, 60, 0.18)";


  const [input, setInput] = useState("");
  const [position, setPosition] = useState({
    x: Math.max(24, window.innerWidth - 420 - 24),
    y: Math.max(24, window.innerHeight - 600 - 24),
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({
    width: 420,
    height: 600,
  });

  const SIDEBAR_BREAKPOINT = 700;
  const isSidebarAllowed =
  isMobile || size.width >= SIDEBAR_BREAKPOINT;

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    mode === "authenticated"
  );

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    positionX: 0,
    positionY: 0,
  });
  const resizeStart = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 0,
    height: 0,
    positionX: 0,
    positionY: 0,
    direction: "",
  });

  const handleDragStart = (event: React.PointerEvent<HTMLElement>) => {
    if (isMobile || isResizing) {
      return;
    }

    const target = event.target as HTMLElement;

    // Do not start dragging when interacting with controls.
    if (target.closest("button, select, textarea, input, a")) {
      return;
    }

    event.preventDefault();

    dragStart.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      positionX: position.x,
      positionY: position.y,
    };

    setIsDragging(true);
  };

const handleDragMove = useCallback(
  (event: PointerEvent) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - dragStart.current.mouseX;
    const deltaY = event.clientY - dragStart.current.mouseY;

    const nextX = dragStart.current.positionX + deltaX;
    const nextY = dragStart.current.positionY + deltaY;

    const maxX = Math.max(24, window.innerWidth - size.width - 24);
    const maxY = Math.max(24, window.innerHeight - size.height - 24);

    setPosition({
      x: Math.min(Math.max(24, nextX), maxX),
      y: Math.min(Math.max(24, nextY), maxY),
    });
  },
  [isDragging, size.width, size.height]
);

const handleDragEnd = useCallback(() => {
  setIsDragging(false);
}, []);

useEffect(() => {
  if (!isDragging) {
    return;
  }

  window.addEventListener("pointermove", handleDragMove);
  window.addEventListener("pointerup", handleDragEnd);
  window.addEventListener("pointercancel", handleDragEnd);

  return () => {
    window.removeEventListener("pointermove", handleDragMove);
    window.removeEventListener("pointerup", handleDragEnd);
    window.removeEventListener("pointercancel", handleDragEnd);
  };
}, [isDragging, handleDragMove, handleDragEnd]);


  const handleResizeStart = (
  event: React.PointerEvent<HTMLDivElement>,
  direction: string
) => {
  if (isMobile) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  event.currentTarget.setPointerCapture(event.pointerId);

  resizeStart.current = {
    mouseX: event.clientX,
    mouseY: event.clientY,
    width: size.width,
    height: size.height,
    positionX: position.x,
    positionY: position.y,
    direction,
  };

  setIsResizing(true);
};

const handleResizeMove = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  if (!isResizing) {
    return;
  }

  const start = resizeStart.current;
  const deltaX = event.clientX - start.mouseX;
  const deltaY = event.clientY - start.mouseY;

  const minWidth = 320;
  const minHeight = 460;

  let nextWidth = start.width;
  let nextHeight = start.height;
  let nextX = start.positionX;
  let nextY = start.positionY;

  if (start.direction.includes("right")) {
    nextWidth = start.width + deltaX;
  }

  if (start.direction.includes("left")) {
    nextWidth = start.width - deltaX;
    nextX = start.positionX + deltaX;
  }

  if (start.direction.includes("bottom")) {
    nextHeight = start.height + deltaY;
  }

  if (start.direction.includes("top")) {
    nextHeight = start.height - deltaY;
    nextY = start.positionY + deltaY;
  }

  if (nextWidth < minWidth) {
    nextWidth = minWidth;

    if (start.direction.includes("left")) {
      nextX = start.positionX + (start.width - minWidth);
    }
  }

  if (nextHeight < minHeight) {
    nextHeight = minHeight;

    if (start.direction.includes("top")) {
      nextY = start.positionY + (start.height - minHeight);
    }
  }

  const maxWidth = window.innerWidth - 48;
  const maxHeight = window.innerHeight - 120;

  nextWidth = Math.min(nextWidth, maxWidth);
  nextHeight = Math.min(nextHeight, maxHeight);

  setSize({
    width: nextWidth,
    height: nextHeight,
  });

  setPosition({
    x: Math.max(24, nextX),
    y: Math.max(24, nextY),
  });
};

const handleResizeEnd = (
  event?: React.PointerEvent<HTMLDivElement>
) => {
  if (
    event &&
    event.currentTarget.hasPointerCapture(event.pointerId)
  ) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  setIsResizing(false);
};



  const defaultAgentId: AIAgentId =
    mode === "public"
      ? "crm-assistant"
      : "organization-assistant";

  const selectedAgent =
    AGENTS.find((agent) => agent.id === (agentId ?? defaultAgentId)) ??
    AGENTS[0];

  const uniqueSources = Array.from(
    new Map(
      sources.map((source) => [source.sourceId, source])
    ).values()
  );

  const suggestedPrompts =
    SUGGESTED_PROMPTS[selectedAgent.id] ?? [];

  const getAgentName = (agentId: AIAgentId) => {
    return AGENTS.find((agent) => agent.id === agentId)?.name ?? agentId;
  };

  const handleClose = () => {
    dispatch(closeAIWorkspace());
  };

  const handleNewConversation = () => {
    dispatch(clearConversation());
  };

  const handleAgentChange = (nextAgentId: AIAgentId) => {
    dispatch(setAgentId(nextAgentId));
    dispatch(clearConversation());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = input.trim();
    const activeAgentId = agentId ?? defaultAgentId;

    if (!message || loading) {
      return;
    }

    if (mode === "public") {
      dispatch(
        sendPublicAIChat({
          message,
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Public AI chat result:", result);
        })
        .catch((error) => {
          console.error("Public AI chat failed:", error);
        });
    } else {
      dispatch(
        sendAIChat({
          agentId: activeAgentId,
          message,
          ...(conversationId ? { conversationId } : {}),
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Authenticated AI chat result:", result);
        })
        .catch((error) => {
          console.error("Authenticated AI chat failed:", error);
        });
    }

    setInput("");
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const form = event.currentTarget.form;

      if (form) {
        form.requestSubmit();
      }
    }
  };

const handleConfirm = () => {
  console.log("Confirmation state:", confirmation);
  console.log(
    "Confirmation ID being sent:",
    confirmation?.confirmationId
  );

  if (!confirmation?.confirmationId) {
    return;
  }

  dispatch(confirmAIAction(confirmation.confirmationId))
    .unwrap()
    .then((result) => {
      console.log("Confirmation result:", result);
    })
    .catch((error) => {
      console.error("Confirmation failed:", error);
    });
};

  const handleCancel = () => {
    dispatch(clearConfirmation());
  };

  const confirmationArguments = confirmation?.toolCall.arguments as
    | ConfirmationArguments
    | undefined;

  const confirmationEntries = confirmationArguments
    ? Object.entries(confirmationArguments).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
    : [];

 const getAgentDescription = (agentId: AIAgentId) => {
  const descriptions: Record<AIAgentId, string> = {
    "personal-assistant":
      "Helps with your daily work and can access your personal data such as creating personal notes and creating personal tasks (more tools to be added soon).",

   "organization-assistant":
  "Helps with daily work, career growth, and teamwork, with access to organization CRM data such as leads, contacts, customers, notes, and other organization records as tools become available(to be updated).",

    "crm-assistant":
      "Answers general questions about uniThread CRM, including features, pricing, policies, terms, and how the CRM works.",
  };

  return descriptions[agentId];
};

  return (
    <>
      {isOpen && (
        <section
          aria-label="uniThread AI workspace"
          style={{
            position: "fixed",
            zIndex: 5000,
            isolation: "isolate",
            right: "auto",
            bottom: "auto",
            left: isMobile ? "10%" : position.x,
            top: isMobile ? "18%" : position.y,
            width: isMobile ? "60%" : size.width,
            height: isMobile ? "80%" : size.height,
            minWidth: isMobile ? 0 : 320,
            minHeight: isMobile ? 0 : 460,
            display: "flex",
            overflow: "hidden",
            resize: "none",
            color: theme.palette.text.primary,
            border: `1px solid ${glassBorder}`,
            borderRadius:  28,
            background: glassBackground,
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            boxShadow: isDarkMode
              ? `
                  0 24px 80px rgba(0, 0, 0, 0.52),
                  inset 0 1px 0 rgba(255, 255, 255, 0.10),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.025)
                `
              : `
                  0 24px 80px rgba(70, 52, 35, 0.18),
                  inset 0 1px 0 rgba(255, 255, 255, 0.85),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.30)
                `,
          }}
        >
          {mode === "authenticated" &&
              isSidebarOpen &&
              isSidebarAllowed && (
            <aside
              className="ai-conversation-sidebar ai-conversation-scroll"
              style={{
                width: 220,
                minWidth: 220,
                display: "flex",
                paddingBottom: 16,
                flexDirection: "column",
                background: glassSurface,
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                borderRight: `1px solid ${glassBorder}`,
              }}
            >
              <div
                style={{
                  padding: "18px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <strong style={{ fontSize: 14 }}>Conversations</strong>

                <button
                  type="button"
                  onClick={handleNewConversation}
                  title="New conversation"
                  style={{
                    border: "none",
                    borderRadius: 8,
                    background: "rgba(173, 116, 80, 0.12)",
                    color: theme.palette.primary.main,
                    cursor: "pointer",
                    padding: "6px 9px",
                    fontSize: 16,
                  }}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  paddingLeft: "12px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {conversationsLoading ? (
                  <p
                    style={{
                      margin: 8,
                      color: theme.palette.text.secondary,
                      fontSize: 12,
                    }}
                  >
                    Loading conversations...
                  </p>
                ) : conversations.length === 0 ? (
                  <p
                    style={{
                      margin: 8,
                      color: theme.palette.text.secondary,
                      fontSize: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    No saved conversations yet.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      borderTop: `1px solid ${glassBorder}`,
                      borderBottom: `1px solid ${glassBorder}`,
                    }}
                  >
                    {conversations.map((conversation) => {
                      const isActive = conversation.id === conversationId;

                      return (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => {
                            dispatch(loadAIConversation(conversation.id));
                          }}
                          style={{
                          width: "100%",
                          padding: "11px 12px",
                          border: "none",
                          borderBottom: `1px solid ${glassBorder}`,
                          boxShadow: isActive
                            ? `inset 0 0 0 1px ${theme.palette.primary.main}55`
                            : "none",
                          background: isActive
                            ? theme.palette.mode === "dark"
                              ? "rgba(173, 116, 80, 0.20)"
                              : "rgba(173, 116, 80, 0.10)"
                            : "transparent",
                          color: theme.palette.text.primary,
                          textAlign: "left",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                          title={conversation.title ?? "Untitled conversation"}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {conversation.title ?? "Untitled conversation"}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 1,
                              color: theme.palette.text.secondary,
                              fontSize: 9,
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {getAgentName(conversation.agent_id as AIAgentId)}
                            </span>

                            <span>·</span>

                            <span>
                              {new Date(conversation.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          )}

          <div
            style={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >

            <header
              onPointerDown={handleDragStart}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 18px",
                cursor: isDragging ? "grabbing" : isMobile ? "default" : "grab",
                userSelect: "none",
                touchAction: "none",
                background: glassSurface,
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                borderBottom: `1px solid ${glassBorder}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                {mode === "authenticated" && isSidebarAllowed && (
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen((current) => !current)}
                    title="Toggle conversations"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "inherit",
                      cursor: "pointer",
                      fontSize: 18,
                      padding: 4,
                    }}
                  >
                    ☰
                  </button>
                )}

                <div
                  style={{
                    width: 34,
                    height: 34,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: 11,
                    background: theme.palette.primary.main,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {selectedAgent.name === "uniThread AI"
                    ? "U"
                    : selectedAgent.name.charAt(0)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedAgent.name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.58,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedAgent.description}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  flexShrink: 0,
                }}
              >

                <button
                  type="button"
                  onClick={handleClose}
                  title="Close"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: 22,
                    lineHeight: 1,
                    padding: 5,
                  }}
                >
                  ×
                </button>
              </div>
            </header>

            {mode === "authenticated" && (
              <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 18px",
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: glassSurface,
                backdropFilter: "blur(18px) saturate(150%)",
                WebkitBackdropFilter: "blur(18px) saturate(150%)",
              }}
            >
              <label
                htmlFor="ai-agent-select"
                style={{
                  fontSize: 12,
                  opacity: 0.58,
                  whiteSpace: "nowrap",
                }}
              >
                Assistant
              </label>

              <select
                id="ai-agent-select"
                value={agentId ?? "organization-assistant"}
                onChange={(event) =>
                  handleAgentChange(event.target.value as AIAgentId)
                }
                style={{
                  maxWidth: 220,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 10,
                  padding: "7px 10px",
                  background: glassSurfaceStrong,
                  backdropFilter: "blur(16px) saturate(150%)",
                  WebkitBackdropFilter: "blur(16px) saturate(150%)",
                  color: theme.palette.text.primary,
                  outline: "none",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {AGENTS.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                    style={{
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            </>
            )}
            
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    placeItems: "center",
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <div style={{ maxWidth: 420 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        margin: "0 auto 14px",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 18,
                        background: "rgba(173, 116, 80, 0.12)",
                        color: theme.palette.primary.main,
                        fontSize: 24,
                      }}
                    >
                      ✦
                    </div>

                    <h2
                      style={{
                        margin: "0 0 8px",
                        fontSize: 22,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Meet {selectedAgent.name}
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.6,
                        opacity: 0.62,
                      }}
                    >
                      {getAgentDescription(selectedAgent.id)}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 20,
                      }}
                    >
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => {
                            setInput(prompt);
                          }}
                          style={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 999,
                            padding: "9px 13px",
                            background:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.06)"
                                : "rgba(255, 255, 255, 0.38)",
                            backdropFilter: "blur(14px) saturate(140%)",
                            WebkitBackdropFilter: "blur(14px) saturate(140%)",
                            color: theme.palette.text.primary,
                            cursor: "pointer",
                            fontSize: 12,
                            lineHeight: 1.35,
                            transition: "background 0.2s ease, transform 0.2s ease",
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.background =
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(173, 116, 80, 0.10)";
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.background =
                              theme.palette.mode === "dark"
                                ? "rgba(255, 255, 255, 0.06)"
                                : "rgba(255, 255, 255, 0.38)";
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {conversationLoading && (
                <div
                  style={{
                    alignSelf: "center",
                    color: theme.palette.text.secondary,
                    fontSize: 12,
                  }}
                >
                  Loading conversation...
                </div>
              )}

              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "11px 14px",
                        borderRadius: isUser
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        background: isUser
                          ? theme.palette.primary.main
                          : glassSurfaceStrong,
                        border: `1px solid ${
                          isUser ? "transparent" : glassBorder
                        }`,
                        backdropFilter: "blur(18px) saturate(150%)",
                        WebkitBackdropFilter: "blur(18px) saturate(150%)",
                        color: isUser ? "#fff" : theme.palette.text.primary,
                        fontSize: 14,
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    padding: "11px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    background: glassSurfaceStrong,
                    border: `1px solid ${glassBorder}`,
                    backdropFilter: "blur(18px) saturate(150%)",
                    WebkitBackdropFilter: "blur(18px) saturate(150%)",
                    fontSize: 13,
                  }}
                >
                  {selectedAgent.name} is thinking...
                </div>
              )}

            {confirmation && (
            <div
              style={{
                padding: 14,
                border: "1px solid rgba(173, 116, 80, 0.35)",
                borderRadius: 14,
                background: "rgba(173, 116, 80, 0.08)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong>Confirmation required</strong>

              <p
                style={{
                  margin: "6px 0 0",
                  opacity: 0.72,
                }}
              >
                Please review the following action before it is executed.
              </p>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginTop: 8,
                }}
              >
                {getConfirmationActionLabel(confirmation.toolCall.name)}
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 10,
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(0, 0, 0, 0.18)"
                      : "rgba(255, 255, 255, 0.35)",
                  border: `1px solid ${glassBorder}`,
                }}
              >
                {confirmationEntries.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {confirmationEntries.map(([key, value]) => {
                      const isDateField =
                        key === "dueDate" ||
                        key === "due_date" ||
                        key === "startDate" ||
                        key === "start_date" ||
                        key === "endDate" ||
                        key === "end_date";

                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              opacity: 0.58,
                            }}
                          >
                            {formatConfirmationLabel(key)}
                          </span>

                          <span
                            style={{
                              overflowWrap: "anywhere",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {isDateField
                              ? formatConfirmationDate(value)
                              : formatConfirmationValue(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ opacity: 0.7 }}>
                    No additional details were provided.
                  </div>
                )}
              </div>
               <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 12,
                  opacity: 0.62,
                }}
              >
                This action will only proceed after you confirm it.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{
                    border: "none",
                    borderRadius: 9,
                    padding: "8px 14px",
                    background: theme.palette.primary.main,
                    color: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Confirm
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 9,
                    padding: "8px 14px",
                    background: "transparent",
                    color: theme.palette.text.primary,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

              {uniqueSources.length > 0 && (
                <details style={{ fontSize: 12, opacity: 0.72 }}>
                  <summary style={{ cursor: "pointer" }}>
                    Sources ({uniqueSources.length})
                  </summary>

                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {uniqueSources.map((source) => (
                      <li key={source.sourceId}>
                        {source.title ?? source.sourceId}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {error && (
                <div
                  role="alert"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 12px",
                    border: "1px solid rgba(190, 60, 60, 0.25)",
                    borderRadius: 12,
                    color: "#b33",
                    fontSize: 13,
                  }}
                >
                  <span>{error}</span>

                  <button
                    type="button"
                    onClick={() => dispatch(clearAIError())}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                padding: "14px 18px 18px",
                borderTop: `1px solid ${glassBorder}`,
                background: glassSurface,
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
              }}
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={`Ask ${selectedAgent.name}...`}
                rows={1}
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxHeight: 120,
                  resize: "none",
                  border: `1px solid ${glassBorder}`,
                  borderRadius: 16,
                  padding: "11px 13px",
                  background: glassSurfaceStrong,
                  backdropFilter: "blur(16px) saturate(150%)",
                  WebkitBackdropFilter: "blur(16px) saturate(150%)",
                  color: theme.palette.text.primary,
                  outline: "none",
                  font: "inherit",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  border: "none",
                  borderRadius: 13,
                  background:
                    loading || !input.trim() ? "rgba(173, 116, 80, 0.35)" : theme.palette.primary.main,
                  color: "#fff",
                  cursor:
                    loading || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: 11,
                }}
              >
                <SendIcon/>
              </button>
            </form>
          </div>
          {!isMobile  && (
            <>
              {[
                {
                  direction: "top",
                  cursor: "ns-resize",
                  style: {
                    top: -4,
                    left: 16,
                    right: 16,
                    height: 10,
                  },
                },
                {
                  direction: "bottom",
                  cursor: "ns-resize",
                  style: {
                    bottom: -4,
                    left: 16,
                    right: 16,
                    height: 10,
                  },
                },
                {
                  direction: "left",
                  cursor: "ew-resize",
                  style: {
                    left: -4,
                    top: 16,
                    bottom: 16,
                    width: 10,
                  },
                },
                {
                  direction: "right",
                  cursor: "ew-resize",
                  style: {
                    right: -4,
                    top: 16,
                    bottom: 16,
                    width: 10,
                  },
                },
                {
                  direction: "top-left",
                  cursor: "nwse-resize",
                  style: {
                    top: -4,
                    left: -4,
                    width: 18,
                    height: 18,
                  },
                },
                {
                  direction: "top-right",
                  cursor: "nesw-resize",
                  style: {
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                  },
                },
                {
                  direction: "bottom-left",
                  cursor: "nesw-resize",
                  style: {
                    bottom: -4,
                    left: -4,
                    width: 18,
                    height: 18,
                  },
                },
                {
                  direction: "bottom-right",
                  cursor: "nwse-resize",
                  style: {
                    right: -4,
                    bottom: -4,
                    width: 18,
                    height: 18,
                  },
                },
              ].map((handle) => (
                <div
                  key={handle.direction}
                  onPointerDown={(event) =>
                    handleResizeStart(event, handle.direction)
                  }
                  onPointerMove={handleResizeMove}
                  onPointerUp={handleResizeEnd}
                  onPointerCancel={handleResizeEnd}
                  style={{
                    position: "absolute",
                    zIndex: 20,
                    cursor: handle.cursor,
                    touchAction: "none",
                    userSelect: "none",
                    ...handle.style,
                  }}
                />
              ))}
            </>
          )}
        </section>
      )}

      {/* Responsive mobile overrides */}
      <style>
        {`
         @media (max-width: 768px) {
          section[aria-label="uniThread AI workspace"] {
            left: 10% !important;
            top: 18% !important;
            width: 80% !important;
            height: 80% !important;
            min-width: 0 !important;
            min-height: 0 !important;
            border-radius: 30px !important;
            resize: none !important;
          }
        }

            section[aria-label="uniThread AI workspace"] aside.ai-conversation-sidebar {
              position: absolute;
              z-index: 2;
              inset: 0 auto 0 0;
              height: 100%;
            }
          }
          .ai-conversation-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${
              isDarkMode
                ? "rgba(255, 255, 255, 0.22) transparent"
                : "rgba(120, 85, 60, 0.22) transparent"
            };
          }

          .ai-conversation-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .ai-conversation-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .ai-conversation-scroll::-webkit-scrollbar-thumb {
            background: ${
              isDarkMode
                ? "rgba(255, 255, 255, 0.22)"
                : "rgba(120, 85, 60, 0.22)"
            };
            border-radius: 999px;
          }

          .ai-conversation-scroll::-webkit-scrollbar-thumb:hover {
            background: ${
              isDarkMode
                ? "rgba(255, 255, 255, 0.35)"
                : "rgba(120, 85, 60, 0.35)"
            };
          }
        `}
      </style>
      {mode === "public" && !isOpen && (
        <button
          type="button"
          onClick={() => {
            // Replace this with your existing action for opening the AI workspace
            dispatch(openAIWorkspace());
          }}
          title="Open uniThread AI"
          aria-label="Open uniThread AI"
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 5000,
            width: 45,
            height: 45,
            display: "grid",
            placeItems: "center",
            border: "none",
            borderRadius: "50%",
            background: theme.palette.primary.main,
            color: "#fff",
            cursor: "pointer",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                : "0 10px 30px rgba(0, 0, 0, 0.18)",
          }}
        >
          <span style={{ fontSize: 24 }}>✦</span>
        </button>
      )}
    </>
  );
}