import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../hooks/useSidebar";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import useDock from "../hooks/useDock";

import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
} from "@mui/material";

import { navigationTabs } from "../constants/navigation";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import SmsIcon from "@mui/icons-material/Sms";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

export const MOBILE_BOTTOM_NAV_HEIGHT = 64;

const communicationTabs = [
  {
    label: "Notes",
    icon: NoteAltIcon,
    width: 450,
    height: 520,
  },
  {
    label: "Tasks",
    icon: TaskAltIcon,
    width: 450,
    height: 520,
  },
  {
    label: "Chats",
    icon: ChatIcon,
    width: 450,
    height: 520,
  },
  {
    label: "Emails",
    icon: EmailIcon,
    width: 800,
    height: 600,
  },
  {
    label: "Calls",
    icon: CallIcon,
    width: 450,
    height: 520,
  },
  {
    label: "SMS",
    icon: SmsIcon,
    width: 450,
    height: 520,
  },
];

export default function Sidebar() {
  const [tab, setTab] = useState<number | null>(null);

  const { collapsed, setCollapsed } = useSidebar();
  const { openWindow, windows } = useDock();

  const activeCommunicationTabs = communicationTabs
  .map(({ label }) =>
    windows.some(
      (window) => window.id === label.toLowerCase()
    )
  );

  const navigate = useNavigate();
  const location = useLocation();

  const themeMode = useSelector(
    (state: RootState) => state.ui.themeMode
  );

  const handleCommunicationSelect = (index: number) => {
    setTab(index);

    const {
      label,
      icon: Icon,
      width,
      height,
    } = communicationTabs[index];

    openWindow({
      id: label.toLowerCase(),
      title: label,
      Icon,
      width,
      height,
    });
  };

  const path = location.pathname;

  const navigationValue =
    path === "/app/addcontact" || path.startsWith("/app/contacts/")
      ? "/app/contacts"
      : path === "/app/addlead" || path.startsWith("/app/leads/")
      ? "/app/leads"
      : path === "/app/adddeal" || path.startsWith("/app/deals/")
      ? "/app/deals"
      : path;

  return (
    <>
      {/* ===================== DESKTOP SIDEBAR ===================== */}
      <Box
        display={{
          xs: "none",
          sm: "none",
          md: "flex",
        }}
        sx={{
          flexDirection: "column",
          height: "100%",
          position: "fixed",
          zIndex: 500,
          width: collapsed ? 60 : 180,
          transition: "width 0.3s ease",
          alignItems: "flex-end",
          overflow: "hidden",
          left: 0,
          top: 0,
          bottom: 0,
          fontSize: "0.75rem",
          pt: 9,
          borderRight: 0.5,
          borderColor: "#63636338",
          backgroundColor:
            themeMode === "dark"
              ? "#535353a8"
              : "#e7e7e7",
        }}
      >
        {/* Collapse button */}
        <Box
          sx={{
            px: 0.5,
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            borderTop: 0.2,
            borderColor: "#63636338",
          }}
        >
          {/* ===================== CRM NAVIGATION ===================== */}
          <Tabs
            orientation="vertical"
            value={navigationValue}
            onChange={(_, value) => navigate(value)}
            sx={{
              width: "100%",
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {navigationTabs.map(
              ({ label, value, icon: Icon }) => (
                <Tab
                  key={value}
                  value={value}
                  title={label}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                    }
                  }}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                        gap: 1.5,
                        transformOrigin: "left center",
                        transition: "transform .25s ease",
                      }}
                    >
                      <Icon />

                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          opacity: collapsed ? 0 : 1,
                          width: collapsed ? 0 : "auto",
                          transition:
                            "opacity .2s ease, width .3s ease",
                        }}
                      >
                        {label}
                      </Box>
                    </Box>
                  }
                  sx={{
                    minHeight: 48,
                    width: "100%",
                    px: 2,
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "inherit",
                    opacity: 0.7,

                    "&.Mui-selected": {
                      color: "primary.main",
                      opacity: 1,
                    },

                    "&:hover": {
                      backgroundColor: "action.hover",
                    },

                    "&:hover .MuiSvgIcon-root": {
                      transform: collapsed
                        ? "scale(1.2)"
                        : "scale(1.12)",
                    },

                    "& .MuiSvgIcon-root": {
                      transition:
                        "transform .25s ease",
                    },
                  }}
                />
              )
            )}
          </Tabs>

          {/* ===================== COMMUNICATION DIVIDER ===================== */}
          <Divider
            sx={{
              width: "calc(100% - 16px)",
              mx: 1,
              my: 1,
            }}
          />

          {/* Communication label */}
          <Box
            sx={{
              px: 2,
              mb: 0.5,
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              height: collapsed ? 0 : "auto",
              overflow: "hidden",
              transition:
                "opacity .2s ease, height .3s ease",
            }}
          >
            COMMUNICATION
          </Box>

          {/* ===================== COMMUNICATION TABS ===================== */}
          <Tabs
            orientation="vertical"
            value={false}
            onChange={(_, value) => setTab(value)}
            sx={{
              width: "100%",
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {communicationTabs.map(
              (
                {
                  label,
                  icon: Icon,
                  width,
                  height,
                },
                index
              ) => (
                <Tab
                  key={label}
                  value={index}
                  title={label}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false);
                    }

                    openWindow({
                      id: label.toLowerCase(),
                      title: label,
                      Icon,
                      width,
                      height,
                    });
                  }}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                        gap: 1.5,
                        transformOrigin: "left center",
                        transition:
                          "transform .25s ease",
                      }}
                    >
                      <Icon />

                      <Box
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          opacity: collapsed ? 0 : 1,
                          width: collapsed ? 0 : "auto",
                          transition:
                            "opacity .2s ease, width .3s ease",
                        }}
                      >
                        {label}
                      </Box>
                    </Box>
                  }
                  sx={{
                    minHeight: 48,
                    width: "100%",
                    px: 2,
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "inherit",
                    opacity: 0.7,

                    ...(activeCommunicationTabs[index] && {
                      color: "primary.main",
                      opacity: 1,
                    }),

                    "&:hover": {
                      backgroundColor: "action.hover",
                    },

                    "&:hover .MuiSvgIcon-root": {
                      transform: collapsed
                        ? "scale(1.2)"
                        : "scale(1.12)",
                    },

                    "& .MuiSvgIcon-root": {
                      transition:
                        "transform .25s ease",
                    },
                  }}
                />
              )
            )}
          </Tabs>
        </Box>
      </Box>

      {/* ===================== MOBILE BOTTOM NAVIGATION ===================== */}
      <Paper
        elevation={3}
        sx={{
          display: {
            xs: "block",
            sm: "block",
            md: "none",
          },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          borderTop: "0.5px solid",
          borderColor: "#63636338",
        }}
      >
        <BottomNavigation
          showLabels
          value={tab}
          onChange={(_, newValue: number) =>
            handleCommunicationSelect(newValue)
          }
          sx={{
            height: MOBILE_BOTTOM_NAV_HEIGHT,
            backgroundColor:
              themeMode === "dark"
                ? "#2b2b2b"
                : "#ffffff",
          }}
        >
          {communicationTabs.map(
            ({ label, icon: Icon }) => (
              <BottomNavigationAction
                key={label}
                label={label}
                icon={<Icon fontSize="small" />}
                sx={{
                  minWidth: 0,
                  px: 0.5,
                  color: "inherit",
                  opacity: 0.7,

                  "&.Mui-selected": {
                    color: "primary.main",
                    opacity: 1,
                  },

                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "0.65rem",

                    "&.Mui-selected": {
                      fontSize: "0.7rem",
                    },
                  },
                }}
              />
            )
          )}
        </BottomNavigation>
      </Paper>
    </>
  );
}