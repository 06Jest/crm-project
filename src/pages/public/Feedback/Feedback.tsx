// import { useState, type ReactElement } from "react";
// import {
//   Box,
//   Button,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
//   Rating,
//   Divider,
//   Alert,
// } from "@mui/material";
// import SendRoundedIcon from "@mui/icons-material/SendRounded";
// import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
// import { useNavigate } from "react-router-dom";
// import { createFeedbackAPI } from "../../../services/feedbackService";

// export default function Feedback(): ReactElement {
//   const navigate = useNavigate();

//   const [rating, setRating] = useState<number | null>(null);
//   const [feedback, setFeedback] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async () => {
//     if (!feedback.trim()) return;

//     setLoading(true);
//     setError(null);

//     try {
//       await createFeedbackAPI({
//         name: name.trim() || undefined,
//         email: email.trim() || undefined,
//         rating,
//         message: feedback.trim(),
//       });

//       setSubmitted(true);

//       setFeedback("");
//       setName("");
//       setEmail("");
//       setRating(null);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to submit feedback."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           bgcolor: "background.default",
//           p: 3,
//         }}
//       >
//         <Paper
//           elevation={2}
//           sx={{
//             width: "100%",
//             maxWidth: 500,
//             p: 4,
//             borderRadius: 3,
//             textAlign: "center",
//           }}
//         >
//           <FeedbackRoundedIcon
//             color="primary"
//             sx={{ fontSize: 48, mb: 2 }}
//           />

//           <Typography variant="h5" fontWeight={700}>
//             Thank you!
//           </Typography>

//           <Typography
//             color="text.secondary"
//             sx={{ mt: 1.5 }}
//           >
//             Your feedback helps us improve uniThread and
//             prioritize what matters most to our users.
//           </Typography>

//           <Button
//             variant="contained"
//             sx={{ mt: 3 }}
//             onClick={() => navigate("/app/dashboard")}
//           >
//             Back to Dashboard
//           </Button>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         bgcolor: "background.default",
//         p: 3,
//       }}
//     >
//       <Paper
//         elevation={2}
//         sx={{
//           width: "100%",
//           maxWidth: 600,
//           p: { xs: 3, sm: 4 },
//           borderRadius: 3,
//         }}
//       >
//         <Stack spacing={3}>

//           <Box>
//             <Stack
//               direction="row"
//               spacing={1}
//               alignItems="center"
//             >
//               <FeedbackRoundedIcon color="primary" />

//               <Typography
//                 variant="h5"
//                 fontWeight={700}
//               >
//                 Share Your Feedback
//               </Typography>
//             </Stack>

//             <Typography
//               color="text.secondary"
//               sx={{ mt: 1 }}
//             >
//               You're using the beta version of uniThread.
//               Tell us what you think about your experience.
//             </Typography>
//           </Box>

//           <Divider />

//           {error && (
//             <Alert severity="error">
//               {error}
//             </Alert>
//           )}

//           <Box>
//             <Typography
//               fontWeight={600}
//               gutterBottom
//             >
//               How would you rate your experience?
//             </Typography>

//             <Rating
//               value={rating}
//               onChange={(_, value) => setRating(value)}
//               size="large"
//             />
//           </Box>


//           <TextField
//             fullWidth
//             required
//             multiline
//             minRows={5}
//             label="Your feedback"
//             placeholder="What do you like? What could be improved?"
//             value={feedback}
//             onChange={(event) =>
//               setFeedback(event.target.value)
//             }
//             helperText={`${feedback.length}/1000`}
//             slotProps={{
//               htmlInput: {
//                 maxLength: 1000,
//               },
//             }}
//           />


//           <TextField
//             fullWidth
//             label="Name (optional)"
//             placeholder="Your name"
//             value={name}
//             onChange={(event) =>
//               setName(event.target.value)
//             }
//             helperText="(Optional) You can submit feedback anonymously."
//           />


//           <TextField
//             fullWidth
//             label="Email (optional)"
//             placeholder="you@example.com"
//             type="email"
//             value={email}
//             onChange={(event) =>
//               setEmail(event.target.value)
//             }
//             helperText="Leave your email if you'd like us to follow up."
//           />

//           <Alert severity="info">
//             Your feedback helps us identify areas that
//             need improvement and prioritize future updates.
//           </Alert>


//           <Stack
//             direction={{
//               xs: "column-reverse",
//               sm: "row",
//             }}
//             spacing={2}
//             justifyContent="flex-end"
//           >
//             <Button
//               variant="outlined"
//               onClick={() => navigate(-1)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>

//             <Button
//               variant="contained"
//               startIcon={<SendRoundedIcon />}
//               disabled={
//                 !feedback.trim() || loading
//               }
//               onClick={handleSubmit}
//             >
//               {loading
//                 ? "Sending..."
//                 : "Send Feedback"}
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>
//     </Box>
//   );
// }

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
} from "@mui/material";
import { alpha, keyframes } from "@mui/material/styles";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import { useNavigate } from "react-router-dom";
import { createFeedbackAPI } from "../../../services/feedbackService";

// Two lightweight, purely-decorative keyframes. No JS/scroll wiring needed —
// this is a single compact card, not a long page, so a quiet on-mount
// choreography reads better than a scroll-triggered reveal would.
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.85); }
  60% { opacity: 1; transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
`;

// Staggered entrance for the form's direct sections. Respects
// prefers-reduced-motion by disabling the animation outright.
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
  boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.06)",
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

export default function Feedback(): ReactElement {
  const navigate = useNavigate();

  const [rating, setRating] = useState<number | null>(null);
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
        rating,
        message: feedback.trim(),
      });

      setSubmitted(true);

      setFeedback("");
      setName("");
      setEmail("");
      setRating(null);
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

  // Purely presentational: derived from feedback.length for the counter's
  // color only. No new state, no change to the 1000-char enforcement below.
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
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              mb: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
              animation: `${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
              animationDelay: "120ms",
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
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
              transition: "box-shadow 0.15s ease, transform 0.1s ease",
              "&:active": { transform: "scale(0.98)" },
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
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "center",
        bgcolor: "background.default",
        px: { xs: 2, sm: 3 },
        py: { xs: 5, sm: 3 },
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
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
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
                sx={{ display: "block", mt: 0.5 }}
              >
                {rating ? RATING_LABELS[rating] : ""}
              </Typography>
            </Fade>
          </Box>

          <Box sx={reveal(120)}>
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
                  sx={{ color: counterColor, transition: "color 0.2s ease" }}
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

          <Box sx={reveal(160)}>
            <TextField
              fullWidth
              label="Name (optional)"
              placeholder="Your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              helperText="(Optional) You can submit feedback anonymously."
              sx={fieldSx}
            />
          </Box>

          <Box sx={reveal(200)}>
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

          <Alert severity="info" variant="outlined" sx={reveal(240)}>
            Your feedback helps us identify areas that
            need improvement and prioritize future updates.
          </Alert>

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            spacing={2}
            justifyContent="flex-end"
            sx={reveal(280)}
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
              disabled={
                !feedback.trim() || loading
              }
              onClick={handleSubmit}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                transition: "box-shadow 0.15s ease, transform 0.1s ease",
                "&:active": { transform: "scale(0.98)" },
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