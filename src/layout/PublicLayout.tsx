import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AIWorkspace from "../components/AIWorkspace";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { openAIWorkspace } from "../store/uiSlice";
import type { AppDispatch } from "../store/store";
import { setMode } from "../store/aiSlice";

function PublicLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    dispatch(setMode("public"));

    if (!isSmallScreen) {
      dispatch(openAIWorkspace());
    }
  }, [dispatch, isSmallScreen]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: 900,
        }}
      >
        <Outlet />
      </Box>

      <Footer />

      <AIWorkspace />
    </Box>
  );
}

export default PublicLayout;