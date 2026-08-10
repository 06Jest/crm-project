// import { useDispatch, useSelector } from 'react-redux';
// import type { AppDispatch, RootState } from '../../../store/store';
// import { setTheme } from '../../../store/uiSlice';

// import {
//   Box,
//   Typography,
//   Paper,
//   Divider,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
// } from '@mui/material';

// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import LightModeIcon from '@mui/icons-material/LightMode';
// import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

// export default function Settings() {
//   const dispatch = useDispatch<AppDispatch>();
//   const themeMode = useSelector((state: RootState) => state.ui.themeMode);

//   const handleUseSystem = () => {
//     const preferDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
//     dispatch(setTheme(preferDark ? 'dark' : 'light'));
//   };

//   return (
//     <Box sx={{ maxWidth: 720, mx: 'auto' }}>
//       <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
//         Settings
//       </Typography>

//       <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
//         <Box
//           sx={{
//             p: 2.5,
//             borderBottom: 1,
//             borderColor: 'divider',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1.5,
//           }}
//         >
//           {themeMode === 'dark' ? (
//             <DarkModeIcon color="action" />
//           ) : (
//             <LightModeIcon color="action" />
//           )}
//           <Box>
//             <Typography variant="h6" fontWeight={700}>
//               Appearance
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Customize how uniThread CRM looks
//             </Typography>
//           </Box>
//         </Box>

//         <List disablePadding>
//           <ListItem sx={{ py: 2, px: 2.5 }}>
//             <ListItemText
//               primary="Quick select"
//               secondary={
//                 themeMode === 'dark'
//                   ? 'Dark theme is active'
//                   : 'Light theme is active'
//               }
//             />
//             <ListItemSecondaryAction>
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <Button
//                   size="small"
//                   variant={themeMode === 'light' ? 'contained' : 'outlined'}
//                   onClick={() => dispatch(setTheme('light'))}
//                 >
//                   <LightModeIcon />
//                 </Button>
//                 <Button
//                   size="small"
//                   variant={themeMode === 'dark' ? 'contained' : 'outlined'}
//                   onClick={() => dispatch(setTheme('dark'))}
//                 >
//                   <DarkModeIcon />
//                 </Button>
//                 <Button size="small" variant="outlined" onClick={handleUseSystem}>
//                   <SettingsBrightnessIcon />
//                 </Button>
//               </Box>
//             </ListItemSecondaryAction>
//           </ListItem>

//           <Divider />

//           <ListItem sx={{ py: 2, px: 2.5 }}>
//             <ListItemText
//               primary="Match system"
//               secondary="Sets the theme to match your device's current setting"
//             />
//           </ListItem>
//         </List>
//       </Paper>
//     </Box>
//   );
// }

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { setTheme } from '../../../store/uiSlice';

import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ForumIcon from '@mui/icons-material/Forum';
import TuneIcon from '@mui/icons-material/Tune';
import LanguageIcon from '@mui/icons-material/Language';
import SecurityIcon from '@mui/icons-material/Security';

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          p: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {icon}
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <List disablePadding>{children}</List>
    </Paper>
  );
}

function ComingSoonRow({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <ListItem sx={{ py: 2, px: 2.5 }}>
      <ListItemText primary={primary} secondary={secondary} />
      <ListItemSecondaryAction>
        <Chip label="Coming soon" size="small" variant="outlined" />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const handleUseSystem = () => {
    const preferDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    dispatch(setTheme(preferDark ? 'dark' : 'light'));
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 2.5,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {themeMode === 'dark' ? (
            <DarkModeIcon color="action" />
          ) : (
            <LightModeIcon color="action" />
          )}
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Appearance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize how uniThread CRM looks
            </Typography>
          </Box>
        </Box>

        <List disablePadding>
          <ListItem sx={{ py: 2, px: 2.5 }}>
            <ListItemText
              primary="Quick select"
              secondary={
                themeMode === 'dark'
                  ? 'Dark theme is active'
                  : 'Light theme is active'
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  onClick={() => dispatch(setTheme('light'))}
                >
                  <LightModeIcon />
                </Button>
                <Button
                  size="small"
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={() => dispatch(setTheme('dark'))}
                >
                  <DarkModeIcon />
                </Button>
                <Button size="small" variant="outlined" onClick={handleUseSystem}>
                  <SettingsBrightnessIcon />
                </Button>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          <ListItem sx={{ py: 2, px: 2.5 }}>
            <ListItemText
              primary="Match system"
              secondary="Sets the theme to match your device's current setting"
            />
          </ListItem>
        </List>
      </Paper>

      <SectionCard
        icon={<NotificationsIcon color="action" />}
        title="Notifications"
        subtitle="Control what uniThread CRM notifies you about"
      >
        <ComingSoonRow
          primary="Email notifications"
          secondary="Get notified when a lead replies or updates"
        />
        <Divider />
        <ComingSoonRow
          primary="Desktop notifications"
          secondary="Show alerts for new leads and status changes"
        />
        <Divider />
        <ComingSoonRow
          primary="Daily summary"
          secondary="Receive a daily digest of pipeline activity"
        />
      </SectionCard>

      <SectionCard
        icon={<ForumIcon color="action" />}
        title="Communication Defaults"
        subtitle="Defaults used when emailing, calling, or texting leads"
      >
        <ComingSoonRow
          primary="Email signature"
          secondary="Automatically append a signature to outgoing emails"
        />
        <Divider />
        <ComingSoonRow
          primary="Default caller/SMS number"
          secondary="Choose the number used when calling or texting leads"
        />
        <Divider />
        <ComingSoonRow
          primary="Auto-log communications"
          secondary="Automatically save calls and messages to a lead's notes"
        />
      </SectionCard>

      <SectionCard
        icon={<TuneIcon color="action" />}
        title="Preferences"
        subtitle="Fine-tune how the app behaves"
      >
        <ComingSoonRow
          primary="Default landing page"
          secondary="Choose which page opens when you sign in"
        />
        <Divider />
        <ComingSoonRow
          primary="Compact view"
          secondary="Show more leads and contacts per screen"
        />
        <Divider />
        <ComingSoonRow
          primary="Default preferred contact time"
          secondary="Pre-fill this value when adding a new lead"
        />
      </SectionCard>

      <SectionCard
        icon={<LanguageIcon color="action" />}
        title="Language & Region"
        subtitle="Set your locale preferences"
      >
        <ComingSoonRow
          primary="Language"
          secondary="Choose the display language for uniThread CRM"
        />
        <Divider />
        <ComingSoonRow
          primary="Date & time format"
          secondary="Choose how dates and times are displayed"
        />
        <Divider />
        <ComingSoonRow primary="Timezone" secondary="Used for scheduling and timestamps" />
      </SectionCard>

      <SectionCard
        icon={<SecurityIcon color="action" />}
        title="Privacy & Security"
        subtitle="Manage account access and security"
      >
        <ComingSoonRow
          primary="Two-factor authentication"
          secondary="Add an extra layer of security to your account"
        />
        <Divider />
        <ComingSoonRow
          primary="Active sessions"
          secondary="View and sign out of other logged-in devices"
        />
        <Divider />
        <ComingSoonRow
          primary="Login activity"
          secondary="Review recent sign-ins to your account"
        />
      </SectionCard>
    </Box>
  );
}