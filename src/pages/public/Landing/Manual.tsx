
import { Box, Container, Typography, } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const STEPS = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Sign up in seconds with your email or Google account. No credit card required to get started.',
  },
  {
    number: '02',
    title: 'Add your contacts',
    description:
      'Import your existing contacts or add them manually. Organize by status, tags, and custom fields.',
  },
  {
    number: '03',
    title: 'Close more deals',
    description:
      'Track every interaction, follow up on time, and watch your conversion rate climb.',
  },
];

const Manual = () => {

  return (
    <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">

          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight={700}
              letterSpacing={2}
            >
              How it works
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
              Up and running in minutes
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, alignItems: 'center' }}>
            {STEPS.map((step, index) => (
              <Box key={step.number}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  {/* Step number */}
                  <Typography
                    variant="h1"
                    fontWeight={900}
                    color="primary.main"
                    sx={{ opacity: 0.15, lineHeight: 1, mb: 2 }}
                  >
                    {step.number}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    lineHeight={1.7}
                  >
                    {step.description}
                  </Typography>

                  {/* Arrow between steps (not after last) */}
                  {index < STEPS.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        right: -20,
                        top: '50%',
                      }}
                    >
                      <ArrowForwardIcon color="disabled" />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

  )
}

export default Manual