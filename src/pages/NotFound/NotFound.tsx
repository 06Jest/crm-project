import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleBackToDashboard = () => navigate('/dashboard');
  const handleGoBack = () => navigate(-1);

  return (
    <Box
      component="main"
      role="main"
      aria-labelledby="not-found-heading"
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 3,
        py: { xs: 6, sm: 8 },
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Stack spacing={{ xs: 4, sm: 5 }} alignItems="center" textAlign="center">
          <Typography
            aria-hidden="true"
            sx={{
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontSize: { xs: '5rem', sm: '6.5rem', md: '7.5rem' },
              color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              WebkitTextStroke: isDark
                ? '1px rgba(255,255,255,0.18)'
                : '1px rgba(0,0,0,0.14)',
              userSelect: 'none',
            }}
          >
            404
          </Typography>

          <Stack spacing={1.25} alignItems="center">
            <Typography
              id="not-found-heading"
              variant="h5"
              component="h1"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              Page not found
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 380 }}
            >
              The page you&apos;re looking for doesn&apos;t exist or may have
              been moved. You can head back to your workspace from here.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ width: { xs: '100%', sm: 'auto' }, pt: 1 }}
          >
            <Button
              variant="contained"
              disableElevation
              size="large"
              startIcon={<DashboardOutlinedIcon />}
              onClick={handleBackToDashboard}
              sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handleGoBack}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'text.secondary',
                  bgcolor: isDark
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.03)',
                },
              }}
            >
              Go Back
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default NotFoundPage;