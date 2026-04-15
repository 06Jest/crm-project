import { Box,  Container, Typography, Grid, Card,
  CardContent,  Divider, Avatar } from '@mui/material';

  import StarIcon from '@mui/icons-material/Star';

  const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Sales Manager, TechCorp',
    avatar: 'S',
    review:
      'MiniCRM transformed how our team manages leads. We closed 40% more deals in the first month.',
  },
  {
    name: 'Mark Rivera',
    role: 'Freelance Consultant',
    avatar: 'M',
    review:
      'Finally a CRM that is simple enough to actually use every day. The Kanban board is a game changer.',
  },
  {
    name: 'Aisha Patel',
    role: 'Founder, GrowthLab',
    avatar: 'A',
    review:
      'The real-time dashboard gives me instant visibility into my pipeline. I would not run my business without it.',
  },
];

const Testimonials = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">

          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight={700}
              letterSpacing={2}
            >
              Testimonials
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
              Loved by sales teams
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid size={{xs: 12, sm:6}} key={t.name}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    {/* Stars */}
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          fontSize="small"
                          sx={{ color: '#ffd700' }}
                        />
                      ))}
                    </Box>

                    {/* Review text */}
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      lineHeight={1.7}
                      sx={{ mb: 3, fontStyle: 'italic' }}
                    >
                      "{t.review}"
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Reviewer info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {t.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  )
}

export default Testimonials