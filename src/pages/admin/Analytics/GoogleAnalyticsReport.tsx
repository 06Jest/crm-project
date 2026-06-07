
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { trackEvent } from '../../../services/googleAnalyticsService';

export default function GoogleAnalyticsReports() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        📊 Google Analytics 4 Reports
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ Your UniThread CRM frontend is fully integrated with Google Analytics 4.
        All user interactions are automatically tracked.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 6}}>
          <Card elevation={2}>
            <CardHeader title="📈 Main Analytics Dashboard" />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                View comprehensive analytics including user behavior, conversions, and engagement
                metrics.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                endIcon={<OpenInNewIcon />}
                onClick={() => {
                  window.open(
                    'https://analytics.google.com/analytics/web/#/report-home/',
                    '_blank'
                  );
                  trackEvent('super_admin_ga_open_main');
                }}
              >
                Open Google Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, md: 6}}>
          <Card elevation={2}>
            <CardHeader title="⚡ Real-Time Events" />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Watch live events as super admins interact with the platform in real-time.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                endIcon={<OpenInNewIcon />}
                onClick={() => {
                  window.open(
                    'https://analytics.google.com/analytics/web/#/realtime/',
                    '_blank'
                  );
                  trackEvent('super_admin_ga_open_realtime');
                }}
              >
                View Real-Time Data
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Frontend Events */}
        <Grid size={{xs: 12}}>
          <Card elevation={2}>
            <CardHeader title="✅ Frontend Events Being Tracked" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="page_view"
                    secondary="All navigation automatically tracked"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="super_admin_login_attempt"
                    secondary="Login form submissions"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="super_admin_ban_user_attempt"
                    secondary="Ban user button clicks"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="super_admin_delete_user_attempt"
                    secondary="Delete user button clicks"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="super_admin_pause_org_attempt"
                    secondary="Pause organization button clicks"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="super_admin_delete_org_attempt"
                    secondary="Delete organization button clicks"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12}}>
          <Alert severity="info">
            💡 <strong>Backend also logs:</strong> Your backend API endpoints log all actual operations 
            (ban, delete, pause) with detailed metadata, database changes, and audit trails. Frontend tracks 
            UI interactions, Backend tracks actual data operations.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
}