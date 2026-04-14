import { Box, Button, Container, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">

          <Chip
            label="✨ Now with real-time messaging"
            sx={{
              mb: 3,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
            }}
          />


          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            The CRM that helps you{' '}
            <Box component="span" sx={{ color: '#ffd700' }}>
              close more deals
            </Box>
          </Typography>


          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              mb: 5,
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            MiniCRM gives your team a simple, powerful way to manage
            contacts, track leads, and grow your business — all in one place.
          </Typography>


          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Get started free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Log in
            </Button>
          </Box>


          <Typography
            variant="body2"
            sx={{ mt: 4, opacity: 0.75 }}
          >
            No credit card required · Free forever plan available
          </Typography>
        </Container>
      </Box>
  )
}

export default Hero