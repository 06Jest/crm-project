
import { useState, Suspense, lazy, type ReactElement, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Stepper, Step, StepLabel, 
  Container, Fade, CircularProgress, useMediaQuery, useTheme,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { getCurrentUser } from '../../../store/userSlice';
import { useAuth } from '../../../hooks/useAuth';
import type { DisplayProfile } from '../../../types/profile';

const ProfileStep = lazy(() => import('./ProfileStep'));
const WorkspaceStep = lazy(() => import('./WorkspaceStep'));
const SubscriptionStep = lazy(() => import('./SubscriptionStep'));

type OnboardingStep = 1 | 2 | 3;

// const MinimalConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 12 },
//   [`& .${stepConnectorClasses.line}`]: {
//     borderColor: theme.palette.divider,
//     borderTopWidth: 2,
//     transition: 'border-color 0.3s ease',
//   },
//   [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
//   [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
// }));

function MinimalStepIcon({ active, completed, icon }: { active?: boolean; completed?: boolean; icon: ReactNode }) {
  return (
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
      color: active || completed ? 'primary.contrastText' : 'text.secondary',
      bgcolor: active || completed ? 'primary.main' : 'transparent',
      border: '1.5px solid',
      borderColor: active || completed ? 'primary.main' : 'divider',
      transition: 'all 0.25s ease',
    }}>
      {completed ? <CheckRoundedIcon sx={{ fontSize: 14 }} /> : icon}
    </Box>
  );
}

export default function Onboarding(): ReactElement {
  const { user, loading: userLoading } = useAuth();

  if (userLoading || !user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={32} thickness={4} />
      </Box>
    );
  }

  return <OnboardingWizard key={user.id} user={user} />;
}

function OnboardingWizard({ user }: { user: DisplayProfile }): ReactElement {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    () => Math.min((user.onboarding_step ?? 0) + 1, 3) as OnboardingStep
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = ['Profile', 'Workspace', 'Subscription'];

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) as OnboardingStep);
  };

  const handleFinish = async () => {
    await dispatch(getCurrentUser()).unwrap();
    navigate("/approval", { replace: true });
  };

  const renderStepContent = (): ReactElement => {
    switch (currentStep) {
      case 1: return <ProfileStep onNext={handleNext} />;
      case 2: return <WorkspaceStep onNext={handleNext} onFinish={handleFinish} />;
      case 3: return <SubscriptionStep onFinish={handleFinish} />;
      default: return <ProfileStep onNext={handleNext} />;
    }
  };


  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'background.default', py: isMobile ? 3 : 5, px: isMobile ? 1.5 : 2,
    }}>
      <Container maxWidth="md" disableGutters>
        <Paper elevation={0} sx={{
          p: isMobile ? 3 : 5, borderRadius: 3, maxWidth: 680, mx: 'auto',
          border: '1px solid', borderColor: 'divider',
          boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)',
        }}>
          
          <Stepper
            activeStep={0}
            sx={{
              mb: { xs: 3, sm: 5 },
              '& .MuiStepConnector-root': {
                display: 'none',
              },
              '& .MuiStepLabel-label': {
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                fontWeight: 700,
                color: 'text.primary',
                mt: '6px !important',
              },
            }}
          >
            <Step>
              <StepLabel StepIconComponent={MinimalStepIcon}>
                {steps[currentStep - 1]}
              </StepLabel>
            </Step>
          </Stepper>

          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={26} thickness={4} /></Box>
          }>
            <Fade in key={currentStep} timeout={350}>
              <Box>{renderStepContent()}</Box>
            </Fade>
          </Suspense>
        </Paper>
      </Container>
    </Box>
  );
}