import { Box, Button, Container, Typography} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <Box
        sx={{
          userSelect: 'none',
          py: { xs: 10, md: 14 },
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mb: 2 }}
          >
            Ready to grow your business?
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, mb: 5, fontWeight: 400 }}
          >
            Join thousands of sales teams already using MiniCRM.
            Get started in minutes — no credit card required.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 700,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Create your free account
          </Button>
        </Container>
      </Box>
  )
}

export default FinalCTA