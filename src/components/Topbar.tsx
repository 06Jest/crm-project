import { Tabs, Tab, Box } from "@mui/material";
// import { useRole } from "../hooks/useRole";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ContactsIcon from "@mui/icons-material/Contacts";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

import HandshakeIcon from "@mui/icons-material/Handshake";
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleChange = (_: unknown, newValue: string) => {
    navigate(newValue);
  };

  const tabs = [
    { label: "Dashboard", value: "/app/dashboard", icon: <DashboardIcon /> },
    { label: "Leads", value: "/app/leads", icon: <PersonSearchIcon /> },
    { label: "Contacts", value: "/app/contacts", icon: <ContactsIcon /> },
    { label: "Deals", value: "/app/deals", icon: <HandshakeIcon /> },
    { label: "Customers", value: "/app/customers", icon: <PermContactCalendarIcon /> },
    { label: "Activities", value: "/app/activities", icon: <EventNoteIcon /> },

  ];

const path = location.pathname;

const tabValue =
  path === "/app/addcontact" || path.startsWith("/app/contacts/")
    ? "/app/contacts"
    : path === "/app/addlead" || path.startsWith("/app/leads/")
    ? "/app/leads"
    : path === "/app/adddeal" || path.startsWith("/app/deals/")
    ? "/app/deals"
    : path;
    

  return (
    <Box
      sx={{
        mt: 7.5,
        position: "fixed",
        left: 0,
        right: 0,
        zIndex: 400,
        borderColor: "divider",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Tabs value={tabValue} onChange={handleChange}
        sx={{
          '& .MuiTabs-indicator': {
                  display: 'none',
                },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            icon={tab.icon}
            iconPosition="start"
            title={tab.label}
            value={tab.value}
            sx={{
              transformOrigin: "top",
              "& .MuiSvgIcon-root": {
                transformOrigin: "top",
                transition: "transform .3s ease",
              },
              "&:hover .MuiSvgIcon-root": {
                transform: "scale(1.4)",

              },
              minWidth: {
                xs: 50,
                sm: 80,
                md: 100
              },
              minHeight: {
                xs: 30,
                sm: 50,
              },
              fontSize: {
                xs: "0.65rem",
                sm: "0.85rem",
                md: "1.2rem",
              },
              padding: {
                xs: "2px 8px",
                sm: "6px 12px",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default Topbar;