import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { navigationTabs } from "../constants/navigation";

export default function Topbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentTab =
    navigationTabs.find((tab) => {
      if (
        tab.value === "/app/contacts" ||
        tab.value === "/app/leads" ||
        tab.value === "/app/deals" ||
        tab.value === "/app/customers"
      ) {
        return (
          location.pathname === tab.value ||
          location.pathname.startsWith(`${tab.value}/`)
        );
      }

      return location.pathname === tab.value;
    }) ?? navigationTabs[0];

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: {
            xs: "flex",
            sm: "flex",
            md: "none",
          },
          top: 64,
          height: 50,
          backgroundColor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: 1900,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "50px !important",
            height: 50,
            px: 1.5,
          }}
        >
          <IconButton
            edge="start"
            onClick={() => setDrawerOpen(true)}
            size="small"
            sx={{ mr: 0.75 }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>

          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {currentTab.label}
          </Typography>
        </Toolbar>
      </AppBar>

     <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            top: 112,
            height: "calc(100% - 112px)",
          },
        }}
      >
        <List sx={{ width: 200, pt: 1 }}>
          {navigationTabs.map(
            ({ label, value, icon: Icon }) => (
              <ListItemButton
                key={value}
                selected={currentTab.value === value}
                onClick={() => handleNavigate(value)}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>

                <ListItemText primary={label} />
              </ListItemButton>
            )
          )}
        </List>
      </Drawer>
    </>
  );
}