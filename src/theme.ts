import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary:{
        main: '#AD7450',
        light: '#c98e6a',
        dark: '#8b6045',
      },

      secondary: {
        main: "#ecc33b",
        light: "#e2d392",
        dark: "#968437",
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
       MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          root: {
            zIndex: 3000,
          },
        },
      },
       MuiAutocomplete: {
        styleOverrides: {
          popper: {
            zIndex: 3000,
          },
        },
      },

      MuiPopover: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          root: {
            zIndex: 3000,
          },
        },
      },
       MuiDialog: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          root: {
            zIndex: 3000,
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
