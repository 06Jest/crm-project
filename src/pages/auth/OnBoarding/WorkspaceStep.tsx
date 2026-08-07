
import { useState, type ReactElement } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  useMediaQuery,
  useTheme,
  Collapse,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { createWorkspaceAPI } from "../../../services/onBoardingService";
import type { CreateWorkspaceDTO, OrganizationType } from '../../../types/organization';
import ErrorAlert from '../../../components/Error';

interface WorkspaceStepProps {
  onBack: () => void;
  onNext: () => void;
}


interface FormErrors {
  workspaceName?: string;
  organizationName?: string;
}

export default function WorkspaceStep({
  onBack,
  onNext,
}: WorkspaceStepProps): ReactElement {
  const [formData, setFormData] = useState<CreateWorkspaceDTO>({
    name: '',
    type: 'personal',
    industry: '',
    product_type: '',
    company_size: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.type === 'personal') {
      if (!formData.name.trim()) {
        newErrors.workspaceName = 'Workspace name is required';
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWorkspaceTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData((prev) => ({
      ...prev,
      type: event.target.value as OrganizationType,
    }));
    setErrors({});
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

  const handleContinue = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await createWorkspaceAPI(formData);

      onNext();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create workspace.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      {(error) && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ErrorAlert
            message={(error) ?? "Failed creating workspace, Try again."}
          />
        </Box>
      )}
      <Box>
        <Typography variant="h5" fontWeight={600} mb={1}>
          Set Up Your Workspace
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Choose whether this is a Personal workspace or for an Organization.
        </Typography>
      </Box>

      <RadioGroup
        value={formData.type}
        onChange={handleWorkspaceTypeChange}
        sx={{
          gap: 2,
        }}
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: formData.type === 'personal' ? 'primary.main' : 'divider',
            borderRadius: 1,
            p: 2,
            cursor: 'pointer',
            backgroundColor:
              formData.type === 'personal' ? 'action.selected' : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          onClick={() =>
            setFormData((prev) => ({ ...prev, type: 'personal' }))
          }
        >
          <FormControlLabel
            value="personal"
            control={<Radio />}
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon color="primary" />
                <Box>
                  <Typography fontWeight={500}>Personal Workspace</Typography>
                  <Typography variant="caption" color="textSecondary">
                    For individual use
                  </Typography>
                </Box>
              </Stack>
            }
          />
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: formData.type === 'business' ? 'primary.main' : 'divider',
            borderRadius: 1,
            p: 2,
            cursor: 'pointer',
            backgroundColor:
              formData.type === 'business' ? 'action.selected' : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          onClick={() =>
            setFormData((prev) => ({ ...prev, type: 'business' }))
          }
        >
          <FormControlLabel
            value="business"
            control={<Radio />}
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <BusinessIcon color="primary" />
                <Box>
                  <Typography fontWeight={500}>Organization</Typography>
                  <Typography variant="caption" color="textSecondary">
                    For teams and companies
                  </Typography>
                </Box>
              </Stack>
            }
          />
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            opacity: 0.5,
            cursor: "not-allowed",
            backgroundColor: "action.disabledBackground",
            "&:hover": {
              borderColor: "divider",
            },
          }}
        >
          <FormControlLabel
            disabled
            value="join"
            control={<Radio />}
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <BusinessIcon color="disabled" />
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={500}>
                      Join Organization
                    </Typography>
                    <Chip
                      label="Coming Soon"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    Join an existing workspace using an invitation code.
                  </Typography>
                </Box>
              </Stack>
            }
          />
        </Box>
      </RadioGroup>

      <Collapse in={formData.type === 'personal'}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Workspace Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.workspaceName}
            helperText={errors.workspaceName}
            placeholder="My Personal Workspace"
            required
          />
          <TextField
            fullWidth
            label="Type of Product/Services"
            name="product_type"
            value={formData.product_type}
            onChange={handleInputChange}
            placeholder="Software Service"
            required
          />
        </Stack>
      </Collapse>

      <Collapse in={formData.type === 'business'}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Organization Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.organizationName}
            helperText={errors.organizationName}
            placeholder="Acme Corporation"
            required
          />
          <TextField
            fullWidth
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="Information Technology(IT)"
          />
          <TextField
            fullWidth
            label="Company size"
            name="company_size"
            value={formData.company_size}
            onChange={handleInputChange}
            placeholder="50"
          />
        </Stack>
      </Collapse>

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
          onClick={onBack}
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
          {loading ? "Creating..." : "Continue"}
        </Button>
      </Box>
    </Stack>
  );
}