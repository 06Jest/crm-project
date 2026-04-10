import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleTheme } from '../store/uiSlice';
import lightLogo from '../assets/crm_logo_transparent.png'
import darkLogo from '../assets/LogoDarkMode.png'

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
          <img src={themeMode === 'light' ? lightLogo : darkLogo} alt="Company Logo" style={{ width: 150 }}/>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={()=> dispatch(toggleTheme())}
            title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
            {themeMode === 'dark' ? (
              <LightModeIcon />
            ): (
              <DarkModeIcon />
            )}
            </IconButton> 
          <Button sx={{ fontWeight: 700}} color="primary">Home</Button>
          <Button sx={{ fontWeight: 700}} color="primary">Menu</Button>
          <Button sx={{ fontWeight: 700}} color="primary">Account</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
};