import { Tabs, Tab, Box } from "@mui/material";
import { useRole } from "../hooks/useRole";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ContactsIcon from "@mui/icons-material/Contacts";
import PersonIcon from "@mui/icons-material/Person";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isSuperAdmin } = useRole();

  const handleChange = (_: unknown, newValue: string) => {
    navigate(newValue);
  };

  const tabs = [
    { label: "Dashboard", value: "/app/dashboard", icon: <DashboardIcon /> },
    { label: "Contacts", value: "/app/contacts", icon: <ContactsIcon /> },
    { label: "Leads", value: "/app/leads", icon: <FolderSharedIcon /> },
    { label: "Deals", value: "/app/deals", icon: <HandshakeIcon /> },
    { label: "Activities", value: "/app/activities", icon: <ViewTimelineIcon /> },
    { label: "Customers", value: "/app/customers", icon: <PersonIcon /> },
    { label: "Messages", value: "/app/messaging", icon: <ChatBubbleIcon /> },

    ...(isAdmin
      ? [{ label: "Reports", value: "/app/reports", icon: <DashboardIcon /> }]
      : []),

    ...(isSuperAdmin
      ? [{ label: "Analytics", value: "/app/analytics", icon: <DashboardIcon /> }]
      : []),
  ];

  return (
    <Box
      sx={{
        mt: 8,
        position: "fixed",
        left: 0,
        right: 0,
        borderBottom: 1,
        zIndex: 2,
        borderColor: "divider",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Tabs value={location.pathname} onChange={handleChange}>
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            icon={tab.icon}
            iconPosition="start"
            title={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default Topbar;