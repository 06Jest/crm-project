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
  Autocomplete,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { completeProfileSetupAPI } from "../../../services/onBoardingService";
import { type CompleteProfileDTO } from '../../../types/profile';
import ErrorAlert from '../../../components/Error';
import { JOB_TITLE_OPTIONS } from '../../../types/global';

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
  const [error, setError] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    } else if (!nameRegex.test(formData.first_name.trim())) {
      newErrors.first_name =
        "Name can only contain letters, spaces, hyphens, or apostrophes.";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    } else if (!nameRegex.test(formData.last_name.trim())) {
      newErrors.last_name =
        "Name can only contain letters, spaces, hyphens, or apostrophes.";
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

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleAvatarClick = (): void => {
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
      {error && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <ErrorAlert message={error} />
        </Box>
      )}

      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.75} letterSpacing="-0.01em">
          Complete Your Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Help us get to know you better. This information will be visible to your team.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <Box sx={{ position: 'relative', width: 'fit-content' }}>
          <Avatar
            sx={{
              width: 84,
              height: 84,
              fontSize: '1.9rem',
              fontWeight: 700,
              bgcolor: 'primary.main',
              border: '3px solid',
              borderColor: 'background.paper',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s ease',
            }}
          >
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              width: 30,
              height: 30,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid',
              borderColor: 'background.paper',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.08)',
              },
            }}
          >
            <CameraAltIcon sx={{ color: 'white', fontSize: 15 }} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
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
        <Grid size={{ xs: 12, sm: 6 }}>
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

      <Autocomplete
        freeSolo
        clearOnBlur={false}
        options={JOB_TITLE_OPTIONS}
        value={formData.job_title ?? ""}
        disabled={loading}
        onChange={(_, value) => {
          setFormData((prev) => ({
            ...prev,
            job_title: value ?? "",
          }));
        }}
        onInputChange={(_, value) => {
          setFormData((prev) => ({
            ...prev,
            job_title: value,
          }));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Job Title"
            placeholder="e.g. Sales Manager"
          />
        )}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          justifyContent: 'flex-end',
          mt: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
        }}
      >
        <Button
          variant="outlined"
          disabled
          fullWidth={isMobile}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleContinue}
          disabled={loading}
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            },
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </Box>
    </Stack>
  );
}