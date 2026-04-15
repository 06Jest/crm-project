import { Box, Button, Container, Typography, Grid, Card,
  CardContent, Chip} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const Pricing = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">

          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight={700}
              letterSpacing={2}
            >
              Pricing
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
              Simple, transparent pricing
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center" alignItems="stretch">


            <Grid size={{xs: 12, sm:6}}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 2,
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>
                    Free
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{ my: 2 }}
                  >
                    $0
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.secondary"
                    >
                      /month
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Perfect for individuals and small teams
                  </Typography>

                  {[
                    'Up to 100 contacts',
                    'Up to 50 leads',
                    'Basic dashboard',
                    'Email support',
                  ].map((item) => (
                    <Box
                      key={item}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        color="success"
                      />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/register')}
                  >
                    Get started free
                  </Button>
                </CardContent>
              </Card>
            </Grid>


            <Grid size={{xs: 12, sm:6}}>
              <Card
                elevation={0}
                sx={{
                  border: 2,
                  borderColor: 'primary.main',
                  borderRadius: 3,
                  p: 2,
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {/* Popular badge */}
                <Chip
                  label="Most popular"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 700,
                  }}
                />

                <CardContent>
                  <Typography variant="h6" fontWeight={700}>
                    Pro
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{ my: 2 }}
                  >
                    $29
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.secondary"
                    >
                      /month
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    For growing teams that need more power
                  </Typography>

                  {[
                    'Unlimited contacts',
                    'Unlimited leads',
                    'Advanced analytics',
                    'Real-time messaging',
                    'Twilio SMS integration',
                    'Priority support',
                  ].map((item) => (
                    <Box
                      key={item}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        color="success"
                      />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/register')}
                  >
                    Start free trial
                  </Button>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>
  )
}

export default Pricing