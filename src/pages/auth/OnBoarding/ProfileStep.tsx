
import { useState, type ReactElement } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { completeProfileSetupAPI } from "../../../services/onBoardingService";
import type { CompleteProfileDTO } from '../../../types/profile';
import ErrorAlert from '../../../components/Error';

interface ProfileStepProps {
  onNext: () => void;
}


interface FormErrors {
  first_name?: string;
  last_name?: string;
}

export default function ProfileStep({ onNext }: ProfileStepProps): ReactElement {
  const [formData, setFormData] = useState<CompleteProfileDTO>({
    first_name: '',
    last_name: '',
    avatar_url: null,
    job_title: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleAvatarClick = (): void => {
    // In production, this would open a file picker
    // For now, we'll just log to show the functionality is available
    console.log('Avatar upload clicked');
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await completeProfileSetupAPI(formData);

      onNext();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete profile setup."
      );
    } finally {
      setLoading(false);
    }
  };

  const initials = `${formData.first_name.charAt(0)}${formData.last_name.charAt(0)}`.toUpperCase();

  return (
    <Stack spacing={3}>
      {(error) && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ErrorAlert
            message={(error) ?? "Failed creating profile, Try again."}
          />
        </Box>
      )}
      <Box>
        <Typography variant="h5" fontWeight={600} mb={1}>
          Complete Your Profile
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Help us get to know you better. This information will be visible to your team.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ position: 'relative', width: 'fit-content' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: '2rem',
              fontWeight: 600,
              backgroundColor: 'primary.main',
            }}
          >
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="avatar" />
            ) : (
              initials || 'U'
            )}
          </Avatar>
          <Box
            onClick={handleAvatarClick}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              p: 0.75,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              transition: 'background-color 0.2s',
            }}
          >
            <CameraAltIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{xs:12, sm: 6}}>
          <TextField
            disabled={loading}
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
            placeholder="John"
            required
          />
        </Grid>
        <Grid size={{xs:12, sm: 6}}>
          <TextField
            disabled={loading}
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
            placeholder="Doe"
            required
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        disabled={loading}
        label="Job Title"
        name="job_title"
        value={formData.job_title}
        onChange={handleInputChange}
        placeholder="Sales Manager"
      />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          mt: 2,
          flexDirection: isMobile ? 'column-reverse' : 'row',
        }}
      >
        <Button
          variant="outlined"
          disabled
          fullWidth={isMobile}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={loading}
          fullWidth={isMobile}
      >
          {loading ? "Saving..." : "Continue"}
      </Button>
      </Box>
    </Stack>
  );
}