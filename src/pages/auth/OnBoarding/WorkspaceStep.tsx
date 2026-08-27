
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
  Zoom,
  Autocomplete,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { createWorkspaceAPI, joinWorkspaceAPI } from "../../../services/onBoardingService";
import type { OrganizationType } from '../../../types/organization';
import ErrorAlert from '../../../components/Error';
import { COMPANY_SIZES, INDUSTRIES, PRODUCT_TYPES } from '../../../types/global';

interface WorkspaceStepProps {
  onNext: () => void;
  onFinish: () => void;
}

interface FormErrors {
  workspaceName?: string;
  organizationName?: string;
}

export default function WorkspaceStep({
  onNext,
  onFinish,
}: WorkspaceStepProps): ReactElement {
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal' as OrganizationType,
    industry: '',
    product_type: '',
    company_size: '',
    code: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceAction, setWorkspaceAction] = useState<"create" | "join">("create");
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isPersonalSelected =
    workspaceAction === "create" && formData.type === "personal";

  const isBusinessSelected =
    workspaceAction === "create" && formData.type === "business";

  const isJoinSelected =
    workspaceAction === "join";

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError(null);

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleContinue = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {

      if (workspaceAction === "join") {

        if (!formData.code.trim()) {
          throw new Error("Invitation code is required");
        }

        await joinWorkspaceAPI(formData.code.trim());

        onFinish();
        return;
      }

      if (!validateForm()) {
        return;
      }

      await createWorkspaceAPI({
        name: formData.name,
        type: formData.type,
        industry: formData.industry,
        product_type: formData.product_type,
        company_size: formData.company_size,
      });

      onNext();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const optionCardSx = (selected: boolean) => ({
    position: 'relative' as const,
    border: '1.5px solid',
    borderColor: selected ? 'primary.main' : 'divider',
    backgroundColor: selected ? 'action.selected' : 'transparent',
    borderRadius: 2,
    p: 2,
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.15s ease',
    '&:hover': {
      borderColor: 'primary.main',
      transform: 'translateY(-1px)',
    },
  });

  const selectionBadge = (selected: boolean) => (
    <Zoom in={selected}>
      <CheckCircleRoundedIcon
        color="primary"
        sx={{ position: 'absolute', top: 10, right: 10, fontSize: 20 }}
      />
    </Zoom>
  );

  return (
    <Stack spacing={3}>
      {error && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <ErrorAlert message={error} />
        </Box>
      )}

      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.75} letterSpacing="-0.01em">
          Set Up Your Workspace
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose whether this is a Personal workspace or for an Organization.
        </Typography>
      </Box>

      <RadioGroup
        value={
          workspaceAction === "join"
            ? "join"
            : formData.type
        }
        onChange={(e) => {
          const value = e.target.value;

          if (value === "join") {
            setWorkspaceAction("join");
            return;
          }

          setWorkspaceAction("create");

          setFormData((prev) => ({
            ...prev,
            type: value as OrganizationType,
          }));
        }}
        sx={{ gap: 1.25 }}
      >
        <Box
          sx={optionCardSx(isPersonalSelected)}
          onClick={() => {
            setWorkspaceAction("create");
            setFormData((prev) => ({ ...prev, type: "personal" }));
          }}
        >
          {selectionBadge(isPersonalSelected)}
          <FormControlLabel
            value="personal"
            control={<Radio size="small" />}
            sx={{ m: 0, width: '100%' }}
            label={
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pr: 3 }}>
                <PersonIcon color={isPersonalSelected ? "primary" : "disabled"} fontSize="small" />
                <Box>
                  <Typography fontWeight={600} variant="body2">Personal Workspace</Typography>
                  <Typography variant="caption" color="text.secondary">
                    For individual use
                  </Typography>
                </Box>
              </Stack>
            }
          />
        </Box>

        <Box
          sx={optionCardSx(isBusinessSelected)}
          onClick={() => {
            setWorkspaceAction("create");
            setFormData((prev) => ({ ...prev, type: "business" }));
          }}
        >
          {selectionBadge(isBusinessSelected)}
          <FormControlLabel
            value="business"
            control={<Radio size="small" />}
            sx={{ m: 0, width: '100%' }}
            label={
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pr: 3 }}>
                <BusinessIcon color={isBusinessSelected ? "primary" : "disabled"} fontSize="small" />
                <Box>
                  <Typography fontWeight={600} variant="body2">Organization</Typography>
                  <Typography variant="caption" color="text.secondary">
                    For teams and companies
                  </Typography>
                </Box>
              </Stack>
            }
          />
        </Box>

        <Box sx={optionCardSx(isJoinSelected)} onClick={() => setWorkspaceAction("join")}>
          {selectionBadge(isJoinSelected)}
          <FormControlLabel
            value="join"
            control={<Radio size="small" />}
            sx={{ m: 0, width: '100%' }}
            label={
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pr: 3 }}>
                <BusinessIcon color={isJoinSelected ? "primary" : "disabled"} fontSize="small" />
                <Box>
                  <Typography fontWeight={600} variant="body2">
                    Join Organization
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Join an existing workspace using an invitation code.
                  </Typography>
                </Box>
              </Stack>
            }
          />
        </Box>
      </RadioGroup>

      <Collapse in={workspaceAction === "create" && formData.type === "personal"} timeout={250}>
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

          <Autocomplete
            freeSolo
            options={INDUSTRIES}
            clearOnBlur={false}
            value={null}
            inputValue={formData.industry ?? ""}
            disabled={loading}
            onInputChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                industry: value,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Industry"
                placeholder="Select your industry"
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={PRODUCT_TYPES}
            clearOnBlur={false}
            value={null}
            inputValue={formData.product_type ?? ""}
            disabled={loading}
            onInputChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                product_type: value,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Type of Product/Services"
                placeholder="Select product or service type"
              />
            )}
          />

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body2"
              fontWeight={700}
              color="primary.main"
              sx={{ mb: 0.5 }}
            >
              Recommended: Create an Organization
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Personal workspaces are intended for individual use. Chat and
              team collaboration are not available here. If you plan to work
              with a team or manage customers together, we highly recommend
              creating an Organization.
            </Typography>
          </Box>
        </Stack>
      </Collapse>

      <Collapse in={workspaceAction === "create" && formData.type === "business"} timeout={250}>
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
          <Autocomplete
            freeSolo
            options={INDUSTRIES}
            clearOnBlur={false}
            value={null}
            inputValue={formData.industry ?? ""}
            disabled={loading}
            onInputChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                industry: value,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Industry"
                placeholder="Select your industry"
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={PRODUCT_TYPES}
            clearOnBlur={false}
            value={null}
            inputValue={formData.product_type ?? ""}
            disabled={loading}
            onInputChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                product_type: value,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Type of Product/Services"
                placeholder="Select product or service type"
              />
            )}
          />
          <Autocomplete
            options={COMPANY_SIZES}
            value={formData.company_size || null}
            disabled={loading}
            onChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                company_size: value ?? '',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Company Size"
                placeholder="Select company size"
              />
            )}
          />
        </Stack>
      </Collapse>

      <Collapse in={workspaceAction === "join"} timeout={250}>
        <TextField
          fullWidth
          label="Invitation Code"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
        />
      </Collapse>

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
          {loading ? "Creating..." : "Continue"}
        </Button>
      </Box>
    </Stack>
  );
}