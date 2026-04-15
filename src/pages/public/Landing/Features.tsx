import { Box, Container, Typography, Grid, Card,
  CardContent, } from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmailIcon from '@mui/icons-material/Email';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';

const FEATURES = [
  {
    icon: <PeopleIcon fontSize="large" />,
    title: 'Contact Management',
    description:
      'Store and organize all your contacts in one place. Add notes, track status, and never lose a lead again.',
  },
  {
    icon: <TrendingUpIcon fontSize="large" />,
    title: 'Lead Pipeline',
    description:
      'Visual Kanban board to track leads from first contact to closed deal. Drag and drop between stages.',
  },
  {
    icon: <DashboardIcon fontSize="large" />,
    title: 'Live Dashboard',
    description:
      'Real-time overview of your sales performance. Charts, stats, and activity feed all in one view.',
  },
  {
    icon: <EmailIcon fontSize="large" />,
    title: 'Email Integration',
    description:
      'Send emails directly from MiniCRM. Track opens, clicks, and replies without leaving the app.',
  },
  {
    icon: <PhoneIcon fontSize="large" />,
    title: 'SMS with Twilio',
    description:
      'Reach customers via SMS instantly. Log calls and messages automatically to the contact timeline.',
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: 'Secure & Private',
    description:
      'Your data is yours. Row-level security ensures each user only sees their own data. Always encrypted.',
  },
];

const Features = () => {
  return (
    <Box sx={{ userSelect: 'none', py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">


          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight={700}
              letterSpacing={2}
            >
              Features
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
              Everything you need to sell smarter
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}
            >
              MiniCRM packs all the tools a growing sales team needs
              without the complexity of enterprise software.
            </Typography>
          </Box>


          <Grid container spacing={3}>
            {FEATURES.map((feature) => (
              <Grid size={{xs: 12, sm: 6, md: 4}} key={feature.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  )
}

export default Features