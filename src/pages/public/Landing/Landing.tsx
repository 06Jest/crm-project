import React, { useState } from "react";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Chip,
  Card,
  Divider,
  Avatar,
  Tabs,
  Tab,
  GlobalStyles,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ContactsIcon from "@mui/icons-material/Contacts";
import HandshakeIcon from "@mui/icons-material/Handshake";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HistoryIcon from "@mui/icons-material/History";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import SmsIcon from "@mui/icons-material/Sms";
import CallIcon from "@mui/icons-material/Call";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExploreIcon from "@mui/icons-material/Explore";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EastIcon from "@mui/icons-material/East";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


type StatusKey = "available" | "simulated" | "planned" | "beta";

const STATUS_META: Record<StatusKey, { label: string; bg: string; color: string }> = {
  available: { label: "Available", bg: "#ECFDF3", color: "#067647" },
  simulated: { label: "Simulated", bg: "#FFFAEB", color: "#B54708" },
  planned: { label: "Planned", bg: "#EFF4FF", color: "#3538CD" },
  beta: { label: "Beta", bg: "#F4F3FF", color: "#5925DC" },
};

const ICON_TILE_SX = {
  width: 44,
  height: 44,
  borderRadius: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "action.hover",
  color: "primary.main",
} as const;


function Section({ id, children, muted }: { id?: string; children: ReactNode; muted?: boolean }) {
  return (
    <Box
      component="section"
      id={id}
      sx={(theme) => ({
        bgcolor: muted ? (theme.palette.mode === "dark" ? "grey.900" : "grey.50") : "transparent",
        py: { xs: 8, md: 12 },
        scrollMarginTop: 80,
      })}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ fontWeight: 700, letterSpacing: 1.2, color: "primary.main", display: "block", mb: 1.5 }}
    >
      {children}
    </Typography>
  );
}

function SectionHeading({
  children,
  align = "left",
  maxWidth,
}: {
  children: ReactNode;
  align?: "left" | "center";
  maxWidth?: number;
}) {
  return (
    <Typography
      variant="h3"
      component="h2"
      sx={{
        fontWeight: 800,
        letterSpacing: -0.5,
        mb: 2,
        textAlign: align,
        maxWidth,
        mx: align === "center" ? "auto" : 0,
        fontSize: { xs: 26, sm: 32, md: 38 },
        lineHeight: 1.2,
      }}
    >
      {children}
    </Typography>
  );
}

function StatusChip({ status, label }: { status: StatusKey; label?: string }) {
  const meta = STATUS_META[status];
  return (
    <Chip
      size="small"
      label={label ?? meta.label}
      sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 700, fontSize: 11, height: 22 }}
    />
  );
}

function FeatureCard({
  icon,
  title,
  description,
  status,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  status?: StatusKey;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        borderColor: "divider",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": { borderColor: "primary.main", boxShadow: "0 4px 20px rgba(16,24,40,0.06)" },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.75 }}>
        <Box sx={ICON_TILE_SX}>{icon}</Box>
        {status && <StatusChip status={status} />}
      </Stack>
      <Typography variant="subtitle1" component="h3" fontWeight={700} sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Card>
  );
}

function MockupFrame({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        borderColor: "divider",
        boxShadow: "0 24px 60px -24px rgba(16,24,40,0.22)",
      }}
    >
      <Box
        sx={(theme) => ({
          px: 2,
          py: 1.1,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        })}
      >
        <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#FF5F57" }} />
        <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#FEBC2E" }} />
        <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#28C840" }} />
        {title && (
          <Typography variant="caption" sx={{ ml: 1, color: "text.secondary", fontWeight: 600 }}>
            {title}
          </Typography>
        )}
      </Box>
      <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: "background.paper" }}>{children}</Box>
    </Card>
  );
}

function DashboardMockup() {
  const stats = [
    { label: "Leads", value: "128", icon: <PersonAddAltIcon sx={{ fontSize: 16 }} /> },
    { label: "Contacts", value: "342", icon: <ContactsIcon sx={{ fontSize: 16 }} /> },
    { label: "Deals", value: "46", icon: <HandshakeIcon sx={{ fontSize: 16 }} /> },
    { label: "Customers", value: "89", icon: <VerifiedUserIcon sx={{ fontSize: 16 }} /> },
  ];
  const bars = [40, 65, 50, 80, 60, 90, 70];
  const activity = [
    { name: "Amelia R.", action: "won a deal", time: "2m ago" },
    { name: "Noah K.", action: "has promoted to manager", time: "18m ago" },
    { name: "Priya S.", action: "completed a call", time: "1h ago" },
  ];
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.25, mb: 2.25 }}>
        {stats.map((s) => (
          <Box key={s.label} sx={{ p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.secondary", mb: 0.5 }}>
              {s.icon}
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 10 }}>
                {s.label}
              </Typography>
            </Stack>
            <Typography variant="subtitle1" fontWeight={800}>
              {s.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", mb: 2.25 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
          PIPELINE ACTIVITY
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 80 }}>
          {bars.map((h, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: `${h}%`,
                borderRadius: 1,
                bgcolor: "primary.main",
                opacity: 0.35 + i * 0.09,
              }}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
          RECENT ACTIVITY
        </Typography>
        <Stack spacing={1.1}>
          {activity.map((a) => (
            <Stack key={a.name} direction="row" spacing={1.1} alignItems="center">
              <Avatar sx={{ width: 26, height: 26, fontSize: 11, bgcolor: "action.hover", color: "text.secondary" }}>
                {a.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" sx={{ flex: 1, fontSize: 13 }}>
                <b>{a.name}</b> {a.action}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {a.time}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function LeadsTableMockup() {
  const rows = [
    { name: "Jordan Blake", status: "New", source: "Website", priority: "High" },
    { name: "Casey Nguyen", status: "Contacted", source: "Referral", priority: "Low" },
    { name: "Morgan Lee", status: "Qualified", source: "Event", priority: "Highest" },
    { name: "Riley Chen", status: "New", source: "Cold Outreach", priority: "Low" },
  ];
  const statusColor: Record<string, string> = { New: "#3538CD", Contacted: "#B54708", Qualified: "#067647" };
  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 1,
          px: 1,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {["Name", "Status", "Source", "Priority"].map((h) => (
          <Typography key={h} variant="caption" fontWeight={700} color="text.secondary">
            {h}
          </Typography>
        ))}
      </Box>
      <Stack divider={<Divider />}>
        {rows.map((r) => (
          <Box
            key={r.name}
            sx={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 1, px: 1, py: 1.1, alignItems: "center" }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: "action.hover", color: "text.secondary" }}>
                {r.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: 13 }}>
                {r.name}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={r.status}
              sx={{
                bgcolor: alpha(statusColor[r.status] ?? "#667085", 0.12),
                color: statusColor[r.status] ?? "#667085",
                fontWeight: 700,
                fontSize: 10,
                height: 20,
                width: "fit-content",
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }} noWrap>
              {r.source}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {r.priority}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function ContactProfileMockup() {
  const fields = [
    { label: "Email", value: "s.mitchell@example.com" },
    { label: "Phone", value: "+1 (555) 019-2231" },
    { label: "Preferred contact", value: "Afternoon" },
    { label: "Owner", value: "Priya S." },
  ];
  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.25 }}>
        <Avatar sx={{ width: 52, height: 52, bgcolor: "action.hover", color: "text.secondary", fontWeight: 700 }}>
          SM
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            Sarah Mitchell
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            VP of Operations · Lumen Retail Group
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5, mb: 2.25 }}>
        {fields.map((f) => (
          <Box key={f.label} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {f.label}
            </Typography>
            <Typography variant="body2" fontWeight={600} noWrap>
              {f.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
        RECENT NOTE
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        "Discussed renewal timeline and follow up after their Q3 budget review."
      </Typography>
    </Box>
  );
}

function DealKanbanMockup() {
  const columns = [
    { name: "Prospecting", deals: [{ title: "Atlas Co.", amount: "$12,400" }] },
    { name: "Proposal", deals: [{ title: "Nimbus Inc.", amount: "$8,200" }, { title: "Fernwood", amount: "$21,000" }] },
    { name: "Negotiation", deals: [{ title: "Brightline", amount: "$45,600" }] },
    { name: "Closed Won", deals: [{ title: "Solace Labs", amount: "$16,900" }] },
  ];
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 1.25 }}>
      {columns.map((col) => (
        <Box key={col.name} sx={{ minWidth: 0 }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }} noWrap>
            {col.name.toUpperCase()}
          </Typography>
          <Stack spacing={1}>
            {col.deals.map((d) => (
              <Box key={d.title} sx={{ p: 1, borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" fontWeight={700} display="block" noWrap>
                  {d.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {d.amount}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

function CustomerDashboardMockup() {
  const stats = [
    { label: "Lifetime deals", value: "4" },
    { label: "Won Deals", value: "2" },
    { label: "Total Revenue", value: "Php 45,700" },
  ];
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 46, height: 46, bgcolor: "action.hover", color: "text.secondary", fontWeight: 700 }}>
            BR
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              Brightline Retail
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Customer since Aug 2026
            </Typography>
          </Box>
        </Stack>
        <StatusChip status="available" label="Active" />
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.25, mb: 2.25 }}>
        {stats.map((f) => (
          <Box key={f.label} sx={{ p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
              {f.label}
            </Typography>
            <Typography variant="subtitle2" fontWeight={800}>
              {f.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function TeamWorkspaceMockup() {
  const members = [
    { name: "Priya Shah", role: "Owner" },
    { name: "Noah Kim", role: "Manager" },
    { name: "Amelia Ruiz", role: "Agent" },
    { name: "Diego Alvarez", role: "Agent" },
  ];
  const roleColor: Record<string, string> = { Owner: "#5925DC", Manager: "#3538CD", Agent: "#067647" };
  return (
    <Stack spacing={1.1}>
      {members.map((m) => (
        <Stack
          key={m.name}
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ p: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
        >
          <Avatar sx={{ width: 30, height: 30, bgcolor: "action.hover", color: "text.secondary", fontSize: 12 }}>
            {m.name
              .split(" ")
              .map((n) => n.charAt(0))
              .join("")}
          </Avatar>
          <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }} noWrap>
            {m.name}
          </Typography>
          <Chip
            size="small"
            label={m.role}
            sx={{ bgcolor: alpha(roleColor[m.role], 0.12), color: roleColor[m.role], fontWeight: 700, fontSize: 10, height: 20 }}
          />
        </Stack>
      ))}
    </Stack>
  );
}

function InternalChatMockup() {
  const messages = [
    { from: "them", name: "Noah", text: "Just moved the Brightline deal to Negotiation.", time: "9:41 AM" },
    { from: "me", name: "You", text: "Great! I'll follow up with procurement today.", time: "9:44 AM" },
    { from: "them", name: "Noah", text: "Sounds good, I'll add a note with the call summary.", time: "9:45 AM" },
  ];
  return (
    <Box>
      <Stack spacing={1.25} sx={{ mb: 2 }}>
        {messages.map((m, i) => (
          <Stack key={i} direction="row" justifyContent={m.from === "me" ? "flex-end" : "flex-start"}>
            <Box
              sx={{
                maxWidth: "78%",
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: m.from === "me" ? "primary.main" : "action.hover",
                color: m.from === "me" ? "primary.contrastText" : "text.primary",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                {m.text}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 0.25 }}>
                {m.name} · {m.time}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, pl: 1 }}>
          Message your team…
        </Typography>
        <IconButton size="small" disabled aria-label="Send message (preview only)">
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

function ProductTour() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "Leads", title: "Leads", content: <LeadsTableMockup /> },
    { label: "Contacts", title: "Contact", content: <ContactProfileMockup /> },
    { label: "Customers", title: "Customer", content: <CustomerDashboardMockup /> },
    { label: "Team", title: "Team Workspace", content: <TeamWorkspaceMockup /> },
    { label: "Chat", title: "Internal Chat", content: <InternalChatMockup /> },
  ];
  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 2.5,
          minHeight: 40,
          borderBottom: "1px solid",
          borderColor: "divider",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, minHeight: 40 },
        }}
      >
        {tabs.map((t, i) => (
          <Tab key={t.label} label={t.label} id={`tour-tab-${i}`} aria-controls={`tour-panel-${i}`} />
        ))}
      </Tabs>
      {tabs.map((t, i) => (
        <Box key={t.label} role="tabpanel" hidden={tab !== i} id={`tour-panel-${i}`} aria-labelledby={`tour-tab-${i}`}>
          {tab === i && <MockupFrame title={t.title}>{t.content}</MockupFrame>}
        </Box>
      ))}
    </Box>
  );
}


function Hero() {
  return (
    <Box component="section" id="top" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 }, scrollMarginTop: 80 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 6, md: 8 }, alignItems: "center" }}>
          <Box>
            <Chip
              label="Beta · Built for modern teams"
              size="small"
              sx={{ mb: 3, fontWeight: 700, bgcolor: "action.hover", color: "primary.main" }}
            />
            <Typography
              variant="h1"
              sx={{ fontWeight: 800, letterSpacing: -1, fontSize: { xs: 32, sm: 42, md: 50 }, lineHeight: 1.12, mb: 3 }}
            >
              One thread connecting your entire customer journey.
            </Typography>
            <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, mb: 4, maxWidth: 520 }}>
              uniThread CRM brings leads, contacts, deals, customers, conversations, activities, and your team together
              in one workspace.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                disableElevation
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3.5 }}
              >
                Get Started
              </Button>
              <Button
                href="#overview"
                variant="outlined"
                size="large"
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3.5 }}
              >
                Explore uniThread
              </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
              Free during Beta. No credit card required.
            </Typography>
          </Box>
          <Box>
            <MockupFrame title="Dashboard">
              <DashboardMockup />
            </MockupFrame>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const SCATTERED_SOURCES = [ "Emails", "Notes", "Calls", "Messages", "Notes"];
const PROBLEM_QUESTIONS = [
  "What happened with this lead?",
  "Who is responsible for this customer?",
  "Where is this deal in the pipeline?",
  "When did we last contact them?",
  "What did the previous conversation involve?",
  "What should happen next?",
];

function ProblemSection() {
  return (
    <Section id="overview" muted>
      <Eyebrow>Relationships shouldn't feel disconnected.</Eyebrow>
      <SectionHeading maxWidth={720}>
        Keep every customer relationship in one connected thread.
      </SectionHeading>
      <Typography color="text.secondary" sx={{ maxWidth: 680, mb: 4 }}>
      Businesses connect with people at every stage. From leads discovering them, to contacts becoming opportunities, to customers building lasting relationships. UniThread brings those relationships together in one place, so businesses can stay connected to the people who matter. </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.25, maxWidth: 680, mb: 6 }}>
        {PROBLEM_QUESTIONS.map((q) => (
          <Stack key={q} direction="row" spacing={1} alignItems="center">
            <ChevronRightIcon sx={{ color: "primary.main", fontSize: 18, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary">
              {q}
            </Typography>
          </Stack>
        ))}
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" }, gap: { xs: 3, md: 4 }, alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, alignContent: "flex-start", minHeight: 140 }}>
          {SCATTERED_SOURCES.map((label, i) => (
            <Chip
              key={label}
              label={label}
              variant="outlined"
              sx={{
                bgcolor: "background.paper",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3) * 2)}deg)`,
              }}
            />
          ))}
        </Box>
        <EastIcon sx={{ fontSize: 30, color: "text.disabled", display: { xs: "none", md: "block" }, mx: "auto" }} />
        <Card
          variant="outlined"
          sx={{ p: 3, borderRadius: 3, borderColor: "primary.main", bgcolor: "background.paper" }}
        >
          <Typography variant="subtitle2" component="h3" fontWeight={700} sx={{ mb: 1.5 }}>
            uniThread workspace
          </Typography>
          <Stack spacing={1}>
            {SCATTERED_SOURCES.map((label) => (
              <Stack key={label} direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 16, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Box>
      <Typography sx={{ fontWeight: 700 }}>
      UniThread solves this by connecting businesses and the people they serve through a single, continuous thread. </Typography>
    </Section>
  );
}


function WhatIsSection() {
  return (
    <Section id="what-is">
      <Box sx={{ maxWidth: 720 }}> <Eyebrow>What is uniThread?</Eyebrow>
        <SectionHeading>
          One thread. Connecting people and the businesses they trust.
        </SectionHeading>
        <Stack spacing={2} sx={{ mb: 3 }}> <Typography color="text.secondary">
        We believe a lead, a contact, or a customer is more than a record in a database. They are people, each with their own needs, conversations, and relationship with a business. </Typography>
        <Typography color="text.secondary">
          The name uniThread represents our belief that those relationships should stay connected through one continuous thread. From the first interaction to a lasting customer relationship.
        </Typography>
        <Typography color="text.secondary">
          Whether a business is following up with a lead, working with a contact, closing a deal, or supporting a customer, every interaction remains part of the same relationship.
        </Typography>
          </Stack>
        <Typography sx={{ fontWeight: 700 }}>
        uniThread connects people, not just data. </Typography> 
      </Box>
    </Section>
  );
}

const LIFECYCLE_STAGES = [
  { title: "Lead", description: "Potential customers entering your sales process.", icon: <PersonAddAltIcon /> },
  { title: "Contact", description: "Qualified people your team is actively building relationships with.", icon: <ContactsIcon /> },
  { title: "Deal", description: "Sales opportunities moving through your pipeline.", icon: <HandshakeIcon /> },
  { title: "Customer", description: "Successful relationships that continue beyond the sale.", icon: <VerifiedUserIcon /> },
];

function LifecycleSection() {
  return (
    <Section id="lifecycle" muted>
      <Eyebrow>CRM Lifecycle</Eyebrow>
      <SectionHeading maxWidth={640}>Follow the relationship from first contact to customer.</SectionHeading>

      <Box sx={{ position: "relative", mt: 6, mb: 5 }}>
        <Box
          sx={{
            position: "absolute",
            top: 22,
            left: "12.5%",
            right: "12.5%",
            height: 2,
            bgcolor: "divider",
            display: { xs: "none", sm: "block" },
          }}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3 }}>
          {LIFECYCLE_STAGES.map((stage) => (
            <Card key={stage.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "divider", position: "relative" }}>
              <Box
                sx={{
                  ...ICON_TILE_SX,
                  borderRadius: "50%",
                  border: "3px solid",
                  borderColor: "background.paper",
                  boxShadow: "0 0 0 1px",
                  color: "primary.contrastText",
                  bgcolor: "primary.main",
                  mb: 2,
                }}
              >
                {stage.icon}
              </Box>
              <Typography variant="subtitle1" component="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                {stage.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stage.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>

      <Stack direction="row" justifyContent="center" sx={{ mb: 7 }}>
        <Button
          href="#features"
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          Explore the CRM workflow
        </Button>
      </Stack>

      <Typography variant="subtitle2" component="h3" fontWeight={700} sx={{ mb: 2 }}>
        See it in the product
      </Typography>
      <ProductTour />
    </Section>
  );
}

const FEATURES = [
  { title: "Leads", description: "Capture, organize, qualify, assign, and track potential customers.", icon: <PersonAddAltIcon /> },
  { title: "Contacts", description: "Keep customer information, communication, notes, and activity in one place.", icon: <ContactsIcon /> },
  { title: "Deals", description: "Manage opportunities through a visual sales pipeline.", icon: <HandshakeIcon /> },
  { title: "Customers", description: "Continue managing relationships after the deal is won.", icon: <VerifiedUserIcon /> },
  { title: "Activities", description: "Keep a history of important actions and interactions.", icon: <HistoryIcon /> },
  {title: "Tasks",
  description: "Plan work ahead, assign a member, set due dates, and keep every follow-up on track.",
  icon: <TaskAltIcon />},
  {title: "Notes", description: "Write strategies, important details, and relationship history in one place across leads, contacts, deals, and customers.", icon: <StickyNote2Icon />},
  { title: "Team Chat", description: "Communicate with your team without leaving the CRM.", icon: <ForumIcon /> },
];

function FeaturesSection() {
  return (
    <Section id="features">
      <Eyebrow>Core Features</Eyebrow>
      <SectionHeading maxWidth={640}>Everything your team needs to manage relationships.</SectionHeading>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5, mt: 5 }}>
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
        ))}
      </Box>
    </Section>
  );
}
const PIPELINE_STAGES = ["Prospecting", "Proposal", "Negotiation", "Closed Won / Lost"];

function PipelineSection() {
  return (
    <Section id="pipeline" muted>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 5, md: 7 }, alignItems: "center" }}>
        <Box>
          <Eyebrow>Sales Pipeline</Eyebrow>
          <SectionHeading>See your sales pipeline at a glance.</SectionHeading>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Move opportunities through your pipeline with a visual workflow.
          </Typography>
          <Stack direction="row" alignItems="center" sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
            {PIPELINE_STAGES.map((s, i) => (
              <React.Fragment key={s}>
                <Chip label={s} variant="outlined" sx={{ fontWeight: 600, bgcolor: "background.paper" }} />
                {i < PIPELINE_STAGES.length - 1 && <EastIcon sx={{ color: "text.disabled", fontSize: 18 }} />}
              </React.Fragment>
            ))}
          </Stack>
          <Typography color="text.secondary">
            See what your team is working on, identify stalled opportunities, and understand where every deal
            stands.
          </Typography>
        </Box>
        <MockupFrame title="Deal Pipeline">
          <DealKanbanMockup />
        </MockupFrame>
      </Box>
    </Section>
  );
}

const COMMUNICATION_CARDS: {
  title: string;
  status: StatusKey;
  description: string;
  note?: string;
  icon: ReactNode;
}[] = [
  {
    title: "Email",
    status: "available",
    description: "Send emails directly through the CRM and keep communication associated with the relevant contact.",
    icon: <EmailIcon />,
  },
  {
    title: "Internal Chat",
    status: "available",
    description: "Communicate with teammates through realtime internal messaging.",
    icon: <ChatIcon />,
  },
  {
    title: "SMS",
    status: "simulated",
    description: "Experience the CRM messaging workflow without requiring an external SMS provider during Beta.",
    note: "SMS does not currently send a real cellular text message.",
    icon: <SmsIcon />,
  },
  {
    title: "Calls",
    status: "simulated",
    description: "Record call outcomes, duration, and notes directly inside the CRM.",
    note: "Calls are currently simulated and do not represent a live VoIP call.",
    icon: <CallIcon />,
  },
];

function CommunicationSection() {
  return (
    <Section id="communication">
      <Eyebrow>Communication</Eyebrow>
      <SectionHeading maxWidth={640}>Keep conversations connected to the relationship.</SectionHeading>
      <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 5 }}>
        Email, messaging, calls, notes, and activities shouldn't exist as isolated records. uniThread keeps
        communication connected to the people and opportunities your team is managing.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
        {COMMUNICATION_CARDS.map((c) => (
          <Card key={c.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "divider" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.75 }}>
              <Box sx={ICON_TILE_SX}>{c.icon}</Box>
              <StatusChip status={c.status} />
            </Stack>
            <Typography variant="subtitle1" component="h3" fontWeight={700} sx={{ mb: 0.5 }}>
              {c.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: c.note ? 1 : 0 }}>
              {c.description}
            </Typography>
            {c.note && (
              <Typography variant="caption" sx={{ color: "#B54708", fontWeight: 600, display: "block" }}>
                {c.note}
              </Typography>
            )}
          </Card>
        ))}
      </Box>
    </Section>
  );
}

const ROLES = [
  { title: "Owner", tagline: "Own the workspace.", description: "Organization management, billing, members, and full workspace access.", icon: <AdminPanelSettingsIcon /> },
  { title: "Manager", tagline: "Manage the team.", description: "Team management and day-to-day CRM operations.", icon: <ManageAccountsIcon /> },
  { title: "Agent", tagline: "Manage relationships.", description: "Work with assigned leads, contacts, deals, and customers.", icon: <BadgeIcon /> },
];

function TeamSection() {
  return (
    <Section id="team" muted>
      <Eyebrow>Team Collaboration</Eyebrow>
      <SectionHeading maxWidth={640}>Give your team one shared workspace.</SectionHeading>
      <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 5 }}>
        Everyone works from the same customer information while permissions determine what each role can manage.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5, mb: 4 }}>
        {ROLES.map((r) => (
          <Card key={r.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "divider" }}>
            <Box sx={{ ...ICON_TILE_SX, mb: 2 }}>{r.icon}</Box>
            <Typography variant="subtitle1" component="h3" fontWeight={700}>
              {r.title}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
              {r.tagline}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {r.description}
            </Typography>
          </Card>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        Roles are part of the CRM's authorization model permissions are enforced across the workspace, not just
        in the interface.
      </Typography>
    </Section>
  );
}

const TENANT_DATA = ["Leads", "Contacts", "Deals", "Customers", "Activities", "Messages", "Members"];

function MultiTenantSection() {
  return (
    <Section id="multi-tenant">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 5, md: 7 }, alignItems: "center" }}>
        <Box>
          <Eyebrow>Multi-Tenant Architecture</Eyebrow>
          <SectionHeading>Your workspace. Your organization's data.</SectionHeading>
          <Stack spacing={2}>
            <Typography color="text.secondary">
              uniThread is built as a multi-tenant SaaS platform. Each organization operates inside its own data
              boundary.
            </Typography>
            <Typography color="text.secondary">
              Organization-level authorization and database security policies work together to protect tenant
              data.
            </Typography>
          </Stack>
        </Box>
        <Card variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "divider" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <BusinessIcon color="primary" />
            <Typography variant="subtitle2" component="h3" fontWeight={700}>
              Your organization's boundary
            </Typography>
          </Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
            {TENANT_DATA.map((d) => (
              <Stack key={d} direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 15, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {d}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Card>
      </Box>
    </Section>
  );
}

const DASHBOARD_CARDS = ["Leads", "Contacts", "Deals", "Customers", "Pipeline activity", "Recent activities", "Business statistics", "Charts"];

function DashboardSection() {
  return (
    <Section id="dashboard" muted>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 5, md: 7 }, alignItems: "center" }}>
        <Box sx={{ order: { xs: 2, md: 1 } }}>
          <MockupFrame title="Dashboard">
            <DashboardMockup />
          </MockupFrame>
        </Box>
        <Box sx={{ order: { xs: 1, md: 2 } }}>
          <Eyebrow>Dashboard</Eyebrow>
          <SectionHeading>Understand your business without digging through records.</SectionHeading>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            The dashboard gives your team a high-level view of what's happening across the CRM.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.25, mb: 3 }}>
            {DASHBOARD_CARDS.map((d) => (
              <Stack key={d} direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 15, color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {d}
                </Typography>
              </Stack>
            ))}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            The dashboard provides the overview. Your CRM records provide the detail.
          </Typography>
        </Box>
      </Box>
    </Section>
  );
}

const GROWTH_POINTS = [
  "Organization-level limits",
  "Role-based access",
  "Data isolation",
  "Pagination",
  "Search optimization",
  "Realtime messaging",
  "Performance improvements",
];

function GrowthSection() {
  return (
    <Section id="growth">
      <Eyebrow>Growth &amp; Performance</Eyebrow>
      <SectionHeading maxWidth={680}>Designed to grow with your organization.</SectionHeading>
      <Typography color="text.secondary" sx={{ maxWidth: 700, mb: 4 }}>
        Whether you're managing a small team or building a larger organization, uniThread is designed around
        resource limits, organization isolation, scalable CRM workflows, and continued performance improvements.
      </Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.25, mb: 3 }}>
        {GROWTH_POINTS.map((p) => (
          <Chip key={p} label={p} variant="outlined" sx={{ fontWeight: 600, bgcolor: "background.paper" }} />
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Built to scale with your organization, not marketed as unlimited.
      </Typography>
    </Section>
  );
}


const AI_CAPABILITIES = ["Contact insights", "Deal summaries", "Predictive scoring", "AI chat assistant", "Reply templates", "Retrieval-augmented answers"];

function AISection() {
  return (
    <Section id="ai" muted>
      <Box sx={{ maxWidth: 760 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Eyebrow>Looking ahead</Eyebrow>
          <StatusChip status="planned" />
        </Stack>
        <SectionHeading>The CRM is evolving.</SectionHeading>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          uniThread is being built with AI-assisted workflows in mind. These capabilities are part of the roadmap
          and should not be presented as currently available functionality.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
          {AI_CAPABILITIES.map((c) => (
            <Stack
              key={c}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ p: 1.5, borderRadius: 2, border: "1px dashed", borderColor: "divider" }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">
                {c}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>
    </Section>
  );
}

const BETA_FOCUS = ["Core CRM workflows", "Multi-tenant architecture", "Team management", "Communication", "Activities", "Security", "Responsive design", "Performance"];

function BetaSection() {
  return (
    <Box
      component="section"
      id="beta"
      sx={(theme) => ({
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.16 : 0.06),
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.2),
        py: { xs: 8, md: 12 },
        scrollMarginTop: 80,
      })}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720 }}>
          <StatusChip status="beta" />
          <Typography
            variant="h4"
            component="h2"
            fontWeight={800}
            sx={{ mt: 2, mb: 2, fontSize: { xs: 26, sm: 32, md: 36 }, letterSpacing: -0.5 }}
          >
            You're looking at uniThread in Beta.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            uniThread is actively evolving. The Beta focuses on building a solid foundation around core CRM
            workflows, multi-tenant architecture, team management, communication, activities, security, responsive
            design, and performance.
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 4 }}>
            {BETA_FOCUS.map((f) => (
              <Chip key={f} label={f} size="small" sx={{ fontWeight: 600, bgcolor: "background.paper" }} />
            ))}
          </Stack>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Some features are still being refined, simulated, or planned. Your feedback helps shape what comes
            next.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              disableElevation
              size="large"
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3.5 }}
            >
              Try the Beta
            </Button>
            <Button
              component={RouterLink}
              to="/roadmap"
              variant="outlined"
              size="large"
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3.5 }}
            >
              View Roadmap
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
const ROADMAP_ITEMS = [
  { title: "Experience", description: "Typing indicators, online presence, unread counts, email templates.", icon: <ExploreIcon /> },
  { title: "Intelligence", description: "AI insights, deal summaries, predictive scoring, AI assistant.", icon: <PsychologyIcon /> },
  { title: "Performance", description: "Expanded realtime updates, caching, pagination, optimized search.", icon: <SpeedIcon /> },
  { title: "Administration", description: "Super admin capabilities.", icon: <AdminPanelSettingsIcon /> },
];

function RoadmapSection() {
  return (
    <Section id="roadmap-preview">
      <Eyebrow>Roadmap</Eyebrow>
      <SectionHeading maxWidth={640}>We're building what comes next.</SectionHeading>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5, mt: 5, mb: 3 }}>
        {ROADMAP_ITEMS.map((r) => (
          <Card key={r.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "divider" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                color: "text.secondary",
                mb: 2,
              }}
            >
              {r.icon}
            </Box>
            <Typography variant="subtitle1" component="h3" fontWeight={700} sx={{ mb: 0.5 }}>
              {r.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {r.description}
            </Typography>
          </Card>
        ))}
      </Box>
      <Button component={RouterLink} to="/roadmap" endIcon={<ArrowForwardIcon />} sx={{ textTransform: "none", fontWeight: 700 }}>
        View the full roadmap
      </Button>
    </Section>
  );
}

const SECURITY_ITEMS = [
  { title: "Authentication", description: "Secure authenticated sessions and email verification.", icon: <VpnKeyIcon /> },
  { title: "Authorization", description: "Role-based access enforced beyond the interface.", icon: <LockIcon /> },
  { title: "Tenant Isolation", description: "Organization-scoped access and database-level security.", icon: <ShieldIcon /> },
  { title: "Validation", description: "Validated requests and controlled API access.", icon: <FactCheckIcon /> },
];

function SecuritySection() {
  return (
    <Section id="security" muted>
      <Eyebrow>Security</Eyebrow>
      <SectionHeading maxWidth={640}>Built with security in mind.</SectionHeading>
      <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 5 }}>
        uniThread uses multiple layers of protection around authentication, authorization, and organization data.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2.5, mb: 4 }}>
        {SECURITY_ITEMS.map((s) => (
          <Card key={s.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: "divider" }}>
            <Box sx={{ ...ICON_TILE_SX, mb: 2 }}>{s.icon}</Box>
            <Typography variant="subtitle1" component="h3" fontWeight={700} sx={{ mb: 0.5 }}>
              {s.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {s.description}
            </Typography>
          </Card>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
        No system is completely immune to risk, uniThread focuses on layered, continuously improving protections
        rather than absolute guarantees.
      </Typography>
      <Button component={RouterLink} to="/help" endIcon={<ArrowForwardIcon />} sx={{ textTransform: "none", fontWeight: 700 }}>
        Learn about security
      </Button>
    </Section>
  );
}

const PRICING_PLANS = [
  { name: "Free", description: "For individuals and small teams exploring uniThread." },
  { name: "Starter", description: "For growing teams." },
  { name: "Team", description: "For larger collaborative teams." },
  { name: "Business", description: "For organizations with higher CRM usage." },
  { name: "Enterprise", description: "For organizations requiring significantly greater capacity." },
];

function PricingPreviewSection() {
  return (
    <Section id="pricing-preview">
      <Eyebrow>Pricing</Eyebrow>
      <SectionHeading maxWidth={640}>Start free. Grow when you need to.</SectionHeading>
      <Typography color="text.secondary" sx={{ maxWidth: 640, mb: 5 }}>
        The current Beta includes a Free plan, with additional plans designed for organizations that need more
        capacity.
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }, gap: 2, mb: 3 }}>
        {PRICING_PLANS.map((p) => (
          <Card key={p.name} variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "divider", textAlign: "center" }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.75 }}>
              {p.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {p.description}
            </Typography>
          </Card>
        ))}
      </Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flexWrap: "wrap" }}>
        <Typography variant="caption" color="text.secondary">
          Plans are being introduced as the platform evolves.
        </Typography>
        <Button component={RouterLink} to="/pricing" endIcon={<ArrowForwardIcon />} sx={{ textTransform: "none", fontWeight: 700 }}>
          View Pricing
        </Button>
      </Stack>
    </Section>
  );
}

const WHY_QUESTIONS = [
  "Who is this person?",
  "How did they find us?",
  "What conversations have we had?",
  "What opportunities are open?",
  "What happened last?",
  "Who is responsible?",
  "What should happen next?",
];

function WhySection() {
  return (
    <Section id="why" muted>
      <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "center" }}>
        <Eyebrow>Why uniThread?</Eyebrow>
        <SectionHeading align="center">More than a database of contacts.</SectionHeading>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          A CRM should tell the story of a relationship.
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5, maxWidth: 720, mx: "auto", mb: 4 }}>
        {WHY_QUESTIONS.map((q) => (
          <Stack
            key={q}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ p: 1.5, borderRadius: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}
          >
            <ChevronRightIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600}>
              {q}
            </Typography>
          </Stack>
        ))}
      </Box>
      <Typography sx={{ textAlign: "center", fontWeight: 700, maxWidth: 560, mx: "auto" }}>
        uniThread brings those answers into one connected thread.
      </Typography>
    </Section>
  );
}

function FinalCTASection() {
  return (
    <Box component="section" sx={{ bgcolor: "grey.900", color: "common.white", py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h2"
          fontWeight={800}
          sx={{ mb: 2, fontSize: { xs: 28, sm: 34, md: 40 }, letterSpacing: -0.5 }}
        >
          Bring your customer relationships into one thread.
        </Typography>
        <Typography sx={{ mb: 4, opacity: 0.75, maxWidth: 560, mx: "auto" }}>
          Manage your leads, contacts, deals, customers, conversations, and team from one workspace.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ mb: 2.5 }}>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            disableElevation
            size="large"
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 4 }}
          >
            Get Started Free
          </Button>
          <Button
            href="#top"
            variant="outlined"
            size="large"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
              color: "common.white",
              borderColor: "rgba(255,255,255,0.3)",
              "&:hover": { borderColor: "common.white", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            Explore the CRM
          </Button>
        </Stack>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          Currently in Beta
        </Typography>
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      <GlobalStyles
        styles={{
          "@media (prefers-reduced-motion: no-preference)": {
            html: { scrollBehavior: "smooth" },
          },
        }}
      />
      <Hero />
      <ProblemSection />
      <WhatIsSection />
      <LifecycleSection />
      <FeaturesSection />
      <PipelineSection />
      <CommunicationSection />
      <TeamSection />
      <MultiTenantSection />
      <DashboardSection />
      <GrowthSection />
      <AISection />
      <BetaSection />
      <RoadmapSection />
      <SecuritySection />
      <PricingPreviewSection />
      <WhySection />
      <FinalCTASection />
    </Box>
  );
}