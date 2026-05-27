import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary:{
        main: '#AD7450',
      },

      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },

    typography: {
      fontFamily: '"Roboto", "Lexend Exa", "Helvetica", "Arial", sans-serif, ',
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
            
          },
          
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            border: mode === 'dark' ? '1px solid #333' : 'none',
          },
        },
      },
    },
  });
