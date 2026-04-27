import {
  Box, Container, Typography, Grid, Card,
  CardContent, Button, Chip, Divider, Accordion,
  AccordionSummary, AccordionDetails,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ── Plan feature data ─────────────────────────────────────
const FREE_FEATURES = [
  { text: 'Up to 100 contacts', included: true },
  { text: 'Up to 50 leads', included: true },
  { text: 'Up to 20 deals', included: true },
  { text: 'Basic dashboard', included: true },
  { text: 'Activity timeline', included: true },
  { text: 'Dark mode', included: true },
  { text: 'Real-time messaging', included: false },
  { text: 'AI assistant', included: false },
  { text: 'CSV export', included: false },
  { text: 'Reports & Analytics', included: false },
  { text: 'Multiple agents', included: false },
  { text: 'Priority support', included: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited contacts', included: true },
  { text: 'Unlimited leads', included: true },
  { text: 'Unlimited deals', included: true },
  { text: 'Advanced dashboard', included: true },
  { text: 'Activity timeline', included: true },
  { text: 'Dark mode', included: true },
  { text: 'Real-time messaging', included: true },
  { text: 'AI assistant (powered by GPT)', included: true },
  { text: 'CSV export', included: true },
  { text: 'Reports & Analytics', included: true },
  { text: 'Up to 10 agents', included: true },
  { text: 'Priority support', included: true },
];

// ── FAQ data ──────────────────────────────────────────────
const FAQS = [
  {
    question: 'Can I try MiniCRM for free?',
    answer:
      'Yes! Our free tier gives you full access to core CRM features with no time limit. No credit card required to get started.',
  },
  {
    question: 'How does agent billing work?',
    answer:
      'The Pro plan includes up to 10 agents. Each agent can log in using their Employee ID. Additional agent seats can be added on request.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Absolutely. You can cancel your Pro subscription at any time. Your account reverts to the free tier — your data is never deleted.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. All data is stored in Supabase with row-level security — each organization only ever sees its own data. Connections are encrypted via HTTPS.',
  },
  {
    question: 'Do you offer a free trial of Pro?',
    answer:
      'We offer a 14-day free trial of the Pro plan. No credit card required. After 14 days you can subscribe or continue on the free tier.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards via Stripe. No PayPal or bank transfer at this time.',
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="Simple pricing"
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontWeight: 600 }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
          >
            Start free. Scale when ready.
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={400}
            sx={{ maxWidth: 520, mx: 'auto' }}
          >
            No hidden fees. No surprise charges. Just simple,
            honest pricing that grows with your team.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Grid container spacing={3} alignItems="stretch">

            {/* Free plan */}
            <Grid sx={{xs:12, md: 6}}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Free
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h2" fontWeight={900}>
                      $0
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      / month
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Perfect for individuals and small teams
                    just getting started with CRM.
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ mb: 3 }}
                  >
                    Get started free
                  </Button>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {FREE_FEATURES.map((feature) => (
                      <Box
                        key={feature.text}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        {feature.included ? (
                          <CheckCircleIcon
                            fontSize="small"
                            sx={{ color: 'success.main', flexShrink: 0 }}
                          />
                        ) : (
                          <CancelIcon
                            fontSize="small"
                            sx={{ color: 'text.disabled', flexShrink: 0 }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          color={feature.included ? 'text.primary' : 'text.disabled'}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{xs:12, md: 6}}>
              <Card
                elevation={0}
                sx={{
                  border: 2,
                  borderColor: 'primary.main',
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
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
                    px: 1,
                  }}
                />

                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Pro
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h2" fontWeight={900}>
                      $29
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      / month
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    For growing teams that need unlimited
                    access and advanced features.
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/register')}
                    sx={{ mb: 3 }}
                  >
                    Start 14-day free trial
                  </Button>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {PRO_FEATURES.map((feature) => (
                      <Box
                        key={feature.text}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: 'success.main', flexShrink: 0 }}
                        />
                        <Typography variant="body2">
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            No credit card required for free tier or trial.
            Cancel anytime.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Compare plans
          </Typography>

          <Card
            elevation={0}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}
          >

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px',
                px: 3,
                py: 2,
                bgcolor: 'background.default',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" fontWeight={700}>Feature</Typography>
              <Typography variant="body2" fontWeight={700} textAlign="center">Free</Typography>
              <Typography variant="body2" fontWeight={700} textAlign="center" color="primary">Pro</Typography>
            </Box>

            {[
              { feature: 'Contacts', free: '100', pro: 'Unlimited' },
              { feature: 'Leads', free: '50', pro: 'Unlimited' },
              { feature: 'Deals', free: '20', pro: 'Unlimited' },
              { feature: 'Agents', free: '1', pro: '10' },
              { feature: 'Dashboard', free: 'Basic', pro: 'Advanced' },
              { feature: 'Dark mode', free: '✅', pro: '✅' },
              { feature: 'CSV Export', free: '❌', pro: '✅' },
              { feature: 'Reports & Analytics', free: '❌', pro: '✅' },
              { feature: 'Real-time messaging', free: '❌', pro: '✅' },
              { feature: 'AI Assistant', free: '❌', pro: '✅' },
              { feature: 'Twilio SMS', free: '❌', pro: '✅' },
              { feature: 'Email integration', free: '❌', pro: '✅' },
              { feature: 'Customer map view', free: '✅', pro: '✅' },
              { feature: 'Support', free: 'Community', pro: 'Priority' },
            ].map((row, i) => (
              <Box
                key={row.feature}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 120px',
                  px: 3,
                  py: 1.5,
                  borderBottom: i < 13 ? 1 : 0,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Typography variant="body2">{row.feature}</Typography>
                <Typography variant="body2" textAlign="center" color="text.secondary">
                  {row.free}
                </Typography>
                <Typography variant="body2" textAlign="center" color="primary" fontWeight={600}>
                  {row.pro}
                </Typography>
              </Box>
            ))}
          </Card>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Frequently asked questions
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {FAQS.map((faq) => (
              <Accordion
                key={faq.question}
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: '8px !important',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: 0 },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Ready to get started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join teams already using MiniCRM. Free forever —
            upgrade only when you need to.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
            >
              Start for free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
