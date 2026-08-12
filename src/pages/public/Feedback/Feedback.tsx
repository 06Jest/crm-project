import { useState, type ReactElement } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Rating,
  Divider,
  Alert,
  Avatar,
  Collapse,
  Fade,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import { useNavigate } from "react-router-dom";
import {
  createFeedbackAPI,
  type FeedbackUserType,
} from "../../../services/feedbackService";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.85); }
  60% { opacity: 1; transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
`;

const reveal = (delayMs: number) => ({
  animation: `${fadeInUp} 0.45s ease both`,
  animationDelay: `${delayMs}ms`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});

const cardSx = {
  width: "100%",
  maxWidth: 600,
  p: { xs: 3, sm: 4 },
  borderRadius: 3,
  borderColor: "divider",
  boxShadow:
    "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.06)",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  },
};

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const USER_TYPE_OPTIONS: {
  value: FeedbackUserType;
  label: string;
  description: string;
}[] = [
  {
    value: "everyday_user",
    label: "Everyday User",
    description:
      "I use CRM software as part of my regular work, such as sales, marketing, customer support, operations, or administration.",
  },
  {
    value: "manager",
    label: "Manager",
    description:
      "I manage a team, business, or organization, such as a business owner, founder, manager, team lead, or department head.",
  },
  {
    value: "technical",
    label: "Technical",
    description:
      "I am a Technical person, such as a software developer, frontend or backend developer, full-stack developer, UI engineer, or other technical professional.",
  },
  {
    value: "prefer_not_to_say",
    label: "Prefer not to say",
    description:
      "I'd rather not share my user type.",
  },
];

export default function Feedback(): ReactElement {
  const navigate = useNavigate();

  const [rating, setRating] = useState<number | null>(null);
  const [userType, setUserType] =
    useState<FeedbackUserType>("prefer_not_to_say");
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createFeedbackAPI({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        userType,
        rating,
        message: feedback.trim(),
      });

      setSubmitted(true);

      setFeedback("");
      setName("");
      setEmail("");
      setRating(null);
      setUserType("prefer_not_to_say");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  const counterColor =
    feedback.length >= 1000
      ? "error.main"
      : feedback.length >= 900
      ? "warning.main"
      : "text.secondary";

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            ...cardSx,
            maxWidth: 500,
            textAlign: "center",
            animation: `${fadeInUp} 0.5s ease both`,
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 2,
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
              animation:
                `${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
              animationDelay: "120ms",
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          >
            <FeedbackRoundedIcon sx={{ fontSize: 34 }} />
          </Avatar>

          <Typography variant="h5" fontWeight={700}>
            Thank you!
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1.5 }}
          >
            Your feedback helps us improve uniThread and
            prioritize what matters most to our users.
          </Typography>

          <Button
            variant="contained"
            disableElevation
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              transition:
                "box-shadow 0.15s ease, transform 0.1s ease",
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={() => navigate("/app/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "background.default",
  px: { xs: 2, sm: 3 },
  pt: { xs: 12, sm: 10 },
  pb: 3,
  boxSizing: "border-box",
}}
    >
      <Paper variant="outlined" sx={cardSx}>
        <Stack spacing={3}>

          <Box sx={reveal(0)}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                }}
              >
                <FeedbackRoundedIcon fontSize="small" />
              </Avatar>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                Share Your Feedback
              </Typography>
            </Stack>

            <Typography
              color="text.secondary"
              sx={{ mt: 1.5 }}
            >
              You're using the beta version of uniThread.
              Tell us what you think about your experience.
            </Typography>
          </Box>

          <Divider sx={reveal(0)} />

          <Collapse in={!!error} unmountOnExit>
            <Alert severity="error" variant="outlined">
              {error}
            </Alert>
          </Collapse>

          <Box sx={reveal(60)}>
            <Typography
              fontWeight={600}
              gutterBottom
            >
              How would you rate your experience?
            </Typography>

            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="large"
            />

            <Fade in={!!rating} unmountOnExit>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.5,
                }}
              >
                {rating ? RATING_LABELS[rating] : ""}
              </Typography>
            </Fade>
          </Box>

          {/* User Type */}
          <Box sx={reveal(100)}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  "&.Mui-focused": {
                    color: "text.primary",
                  },
                }}
              >
                Who best describes you?
              </FormLabel>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.75, mb: 1.5 }}
              >
                This helps us understand your perspective,
                evaluate feedback in the right context, and
                prioritize improvements for different types of
                users. You can choose "Prefer not to say" if
                you don't want to share.
              </Typography>

              <RadioGroup
                value={userType}
                onChange={(event) =>
                  setUserType(
                    event.target.value as FeedbackUserType
                  )
                }
              >
                <Stack spacing={1}>
                  {USER_TYPE_OPTIONS.map((option) => (
                    <Box
                      key={option.value}
                      sx={{
                        border: 1,
                        borderColor:
                          userType === option.value
                            ? "primary.main"
                            : "divider",
                        borderRadius: 2,
                        px: 1.5,
                        py: 1,
                        bgcolor:
                          userType === option.value
                            ? (theme) =>
                                alpha(
                                  theme.palette.primary.main,
                                  0.04
                                )
                            : "transparent",
                        transition:
                          "border-color 0.15s ease, background-color 0.15s ease",
                      }}
                    >
                      <FormControlLabel
                        value={option.value}
                        control={<Radio />}
                        sx={{
                          m: 0,
                          width: "100%",
                          alignItems: "flex-start",
                        }}
                        label={
                          <Box sx={{ pt: 0.35 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                            >
                              {option.label}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "block",
                                mt: 0.25,
                                lineHeight: 1.5,
                              }}
                            >
                              {option.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={reveal(140)}>
            <TextField
              fullWidth
              required
              multiline
              minRows={5}
              label="Your feedback"
              placeholder="What do you like? What could be improved?"
              value={feedback}
              onChange={(event) =>
                setFeedback(event.target.value)
              }
              helperText={
                <Box
                  component="span"
                  sx={{
                    color: counterColor,
                    transition: "color 0.2s ease",
                  }}
                >
                  {feedback.length}/1000
                </Box>
              }
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              sx={fieldSx}
            />
          </Box>

          <Box sx={reveal(180)}>
            <TextField
              fullWidth
              label="Name (optional)"
              placeholder="Your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              helperText="You can submit feedback anonymously. Helpful feedback may be featured in our testimonials."
              sx={fieldSx}
            />
          </Box>

          <Box sx={reveal(220)}>
            <TextField
              fullWidth
              label="Email (optional)"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              helperText="Leave your email if you'd like us to follow up."
              sx={fieldSx}
            />
          </Box>

          <Alert
            severity="info"
            variant="outlined"
            sx={reveal(260)}
          >
            <Typography variant="body2">
              <strong>Why we ask:</strong> Your feedback helps
              us understand different user perspectives, identify
              areas that need improvement, and prioritize future
              updates.
            </Typography>
          </Alert>

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            spacing={2}
            justifyContent="flex-end"
            sx={reveal(300)}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                transition: "background-color 0.15s ease",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<SendRoundedIcon />}
              disabled={!feedback.trim() || loading}
              onClick={handleSubmit}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                transition:
                  "box-shadow 0.15s ease, transform 0.1s ease",
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {loading
                ? "Sending..."
                : "Send Feedback"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}