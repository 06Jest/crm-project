import { useDispatch, useSelector } from "react-redux";

import {
  clearConversation,
  clearAIError,
  clearConfirmation,
  setAgentId,
  sendAIChat,
  confirmAIAction,
} from "../store/aiSlice";

import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import SendIcon from '@mui/icons-material/Send';
import { useTheme, useMediaQuery } from "@mui/material";

import type { RootState, AppDispatch } from "../store/store";

import type { AIAgentId } from "../types/ai";

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
    name: "Uno AI",
    description: "Your uniThread knowledge assistant",
  },
];

export default function AIWorkspace() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    mode,
    messages,
    agentId,
    conversationId,
    loading,
    error,
    confirmation,
    sources,
  } = useSelector((state: RootState) => state.ai);

  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");

  const selectedAgent =
    AGENTS.find((agent) => agent.id === agentId) ?? AGENTS[1];

  const handleOpen = () => {
    setIsOpen(true);

    if (!agentId) {
      dispatch(setAgentId("organization-assistant"));
    }
  };

  const handleClose = () => {
    setIsOpen(false);
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

    if (!message || loading || !agentId) {
      return;
    }

    dispatch(
      sendAIChat({
        agentId,
        message,
        ...(conversationId ? { conversationId } : {}),
      })
    );

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

  dispatch(confirmAIAction(confirmation.confirmationId));
};

const handleCancel = () => {
  dispatch(clearConfirmation());
};

  return (
    <>
      {/* Header launcher */}
      <button
        type="button"
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1300,
          width: 52,
          height: 52,
          border: "1px solid rgba(173, 116, 80, 0.35)",
          borderRadius: "50%",
          background: theme.palette.primary.main,
          color: "#fff",
          cursor: "pointer",
          fontSize: 20,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
        }}
      >
        {isOpen ? "×" : "✦"}
      </button>

      {/* AI window */}
      {isOpen && (
        <section
          aria-label="uniThread AI workspace"
          style={{
            position: "fixed",
            zIndex: 1250,
            right: isMobile ? 0 : 24,
            bottom: isMobile ? 0 : 88,
            width: isMobile
              ? "100%"
              : isExpanded
                ? "min(1100px, calc(100vw - 48px))"
                : "min(860px, calc(100vw - 48px))",
            height: isMobile
              ? "100%"
              : isExpanded
                ? "min(780px, calc(100vh - 120px))"
                : "min(650px, calc(100vh - 120px))",
            minWidth: isMobile ? 0 : 320,
            minHeight: isMobile ? 0 : 460,
            display: "flex",
            overflow: "hidden",
            resize: isMobile ? "none" : "both",
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: isMobile ? 0 : 24,
            background: theme.palette.background.paper,
            backdropFilter: "blur(28px) saturate(150%)",
            WebkitBackdropFilter: "blur(28px) saturate(150%)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 24px 80px rgba(0, 0, 0, 0.55)"
                : "0 24px 80px rgba(0, 0, 0, 0.20)",
          }}
        >
          {/* Sidebar */}
          {mode === "authenticated" && isSidebarOpen && (
            <aside
              style={{
                width: 220,
                minWidth: 220,
                display: "flex",
                flexDirection: "column",
                borderRight: `1px solid ${theme.palette.divider}`,
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.035)"
                    : "rgba(0, 0, 0, 0.025)",
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
                  padding: "0 12px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {conversationId ? (
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      border: `1px solid ${theme.palette.primary.main}55`,
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(173, 116, 80, 0.20)"
                          : "rgba(173, 116, 80, 0.10)",
                      color: theme.palette.text.primary,
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Current conversation
                  </button>
                ) : (
                  <p
                    style={{
                      margin: 8,
                      color: theme.palette.text.secondary,
                      fontSize: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    Your saved conversations will appear here once
                    conversation history endpoints are connected.
                  </p>
                )}
              </div>
            </aside>
          )}

          {/* Main content */}
          <div
            style={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Window header */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 18px",
                borderBottom: `1px solid ${theme.palette.divider}`,
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
                {mode === "authenticated" && (
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
                  {selectedAgent.name === "Uno AI"
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
                    uniThread AI
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
                    {selectedAgent.name} · {selectedAgent.description}
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
                  onClick={() => setIsExpanded((current) => !current)}
                  title={isExpanded ? "Restore window" : "Expand window"}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    fontSize: 16,
                    padding: 7,
                  }}
                >
                  {isExpanded ? "⤢" : "□"}
                </button>

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

            {/* Agent selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 18px",
                borderBottom: `1px solid ${theme.palette.divider}`,
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
                  background: theme.palette.background.paper,
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

            {/* Messages */}
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
                      {selectedAgent.description}. Ask a question to begin
                      your conversation.
                    </p>
                  </div>
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
                          : theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.09)"
                            : "rgba(0, 0, 0, 0.06)",
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
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(173, 116, 80, 0.20)"
                        : "rgba(173, 116, 80, 0.12)",
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

              <p style={{ margin: "6px 0 0", opacity: 0.72 }}>
                This assistant wants to execute an action:
              </p>

              <code
                style={{
                  display: "block",
                  marginTop: 8,
                  overflowWrap: "anywhere",
                }}
              >
                {confirmation.toolCall.name}
              </code>

              {Object.keys(confirmation.toolCall.arguments).length > 0 && (
                <pre
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 8,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.25)"
                        : "rgba(0, 0, 0, 0.05)",
                    fontSize: 12,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(
                    confirmation.toolCall.arguments,
                    null,
                    2
                  )}
                </pre>
              )}

              <div
                style={{
                  display: "flex",
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

              {sources.length > 0 && (
                <details style={{ fontSize: 12, opacity: 0.72 }}>
                  <summary style={{ cursor: "pointer" }}>
                    Sources ({sources.length})
                  </summary>

                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {sources.map((source) => (
                      <li key={`${source.sourceId}-${source.chunkIndex}`}>
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

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                padding: "14px 18px 18px",
                border: `1px solid ${theme.palette.divider}`,
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
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 14,
                  padding: "11px 13px",
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(173, 116, 80, 0.20)"
                      : "rgba(173, 116, 80, 0.12)",
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
        </section>
      )}

      {/* Responsive mobile overrides */}
      <style>
        {`
          @media (max-width: 768px) {
            section[aria-label="uniThread AI workspace"] {
              inset: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100% !important;
              height: 100% !important;
              min-width: 0 !important;
              min-height: 0 !important;
              border-radius: 0 !important;
              resize: none !important;
            }

            section[aria-label="uniThread AI workspace"] aside {
              position: absolute;
              z-index: 2;
              inset: 0 auto 0 0;
              height: 100%;
            }
          }
        `}
      </style>
    </>
  );
}