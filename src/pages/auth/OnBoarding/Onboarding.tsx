
import { useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ProfileStep from './ProfileStep';
import WorkspaceStep from './WorkspaceStep';
import SubscriptionStep from './SubscriptionStep';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { getCurrentUser } from '../../../store/userSlice';

type OnboardingStep = 1 | 2 | 3;

export default function Onboarding(): ReactElement {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
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

    navigate("/app/dashboard", {
      replace: true,
    });
  };

  const handleBack = (): void => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const renderStepContent = (): ReactElement => {
    switch (currentStep) {
      case 1:
        return (
          <ProfileStep
            onNext={handleNext}
          />
        );

      case 2:
        return (
          <WorkspaceStep
            onBack={handleBack}
            onNext={handleNext}
          />
        );

      case 3:
        return (
          <SubscriptionStep
            onBack={handleBack}
            onFinish={handleFinish}
          />
        );

      default:
        return (
          <ProfileStep
            onNext={handleNext}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: isMobile ? 2 : 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 2.5 : 4,
            borderRadius: 2,
            maxWidth: 650,
            mx: 'auto',
          }}
        >
          <Stepper
            activeStep={currentStep - 1}
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent()}
        </Paper>
      </Container>
    </Box>
  );
}