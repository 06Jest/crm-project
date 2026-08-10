// import { useState, type ReactElement } from "react";
// import {
//   Box,
//   Stack,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Chip,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// import { createSubscriptionAPI } from "../../../services/onBoardingService";

// import type {
//   CreateSubscriptionDTO,
//   SubscriptionPlan,
// } from "../../../types/subscription";
// import ErrorAlert from "../../../components/Error";

// interface SubscriptionStepProps {
//   onBack: () => void;
//   onFinish: () => void;
// }

// interface SubscriptionFeature {
//   text: string;
// }

// interface SubscriptionPlanCard {
//   id: SubscriptionPlan;
//   name: string;
//   description: string;
//   features: SubscriptionFeature[];
//   recommended?: boolean;
//   comingSoon?: boolean;
// }

// const SUBSCRIPTION_PLANS: SubscriptionPlanCard[] = [
//   {
//     id: "Free",
//     name: "Free",
//     description: "Perfect for individuals and small personal workspaces.",
//     recommended: true,
//     features: [
//       { text: "Up to 3 members" },
//       { text: "100 Leads & Contacts" },
//       { text: "50 Deals" },
//       { text: "Basic CRM features" },
//       { text: "Email support" },
//     ],
//   },
//   {
//     id: "Starter",
//     name: "Starter",
//     comingSoon: true,
//     description: "Ideal for freelancers and small businesses.",
//     features: [
//       { text: "Up to 10 members" },
//       { text: "1,000 Leads & Contacts" },
//       { text: "500 Deals" },
//       { text: "5,000 Emails" },
//       { text: "2,500 SMS & Calls" },
//     ],
//   },
//   {
//     id: "Team",
//     name: "Team",
//     comingSoon: true,
//     description: "Designed for growing teams that need more capacity.",
//     features: [
//       { text: "Up to 50 members" },
//       { text: "5,000 Leads & Contacts" },
//       { text: "2,000 Deals" },
//       { text: "Advanced collaboration" },
//       { text: "20,000 Emails" },
//     ],
//   },
//   {
//     id: "Business",
//     name: "Business",
//     comingSoon: true,
//     description: "Built for established businesses with large sales teams.",
//     features: [
//       { text: "Up to 200 members" },
//       { text: "20,000 Leads & Contacts" },
//       { text: "10,000 Deals" },
//       { text: "Priority support" },
//       { text: "50,000 Emails" },
//     ],
//   },
//   {
//     id: "Enterprise",
//     name: "Enterprise",
//     comingSoon: true,
//     description: "Maximum scale with enterprise-grade limits.",
//     features: [
//       { text: "Up to 500 members" },
//       { text: "100,000 Leads & Contacts" },
//       { text: "50,000 Deals" },
//       { text: "Dedicated support" },
//       { text: "Custom integrations" },
//     ],
//   },
// ];

// export default function SubscriptionStep({
//   onBack,
//   onFinish,
// }: SubscriptionStepProps): ReactElement {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [formData, setFormData] = useState<CreateSubscriptionDTO>({
//     plan: "Free",
//     billing_cycle: "none",
//     payment_provider: "none",
//     provider_reference: null
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSelectPlan = (plan: SubscriptionPlan): void => {
//     setFormData((prev) => ({
//       ...prev,
//       plan,
//     }));
//   };

//   const handleContinue = async (): Promise<void> => {
//   setLoading(true);
//   setError(null);

//   try {
//     const response = await createSubscriptionAPI(formData);

//     console.log("SUBSCRIPTION RESPONSE:", response);

//     onFinish();

//     console.log("NAVIGATION CALLED");

//   } catch (err) {
//     console.error(err);

//     if (err instanceof Error) {
//       setError(err.message);
//     } else {
//       setError("Failed to create subscription.");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <Stack spacing={3}>
//       {error  && (
//       <Box sx={{ width: '100%', mt: 1 }}>
//         <ErrorAlert
//           message={(error)}
//         />
//       </Box>
//       )}
//       <Box>
//         <Typography variant="h5" fontWeight={600} mb={1}>
//           Choose Your Plan
//         </Typography>

//         <Typography variant="body2" color="text.secondary">
//           Select the plan that best fits your needs. You can always upgrade or
//           downgrade later.
//         </Typography>
//       </Box>

//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: {
//             xs: "1fr",
//             md: "repeat(2,1fr)",
//             lg: "repeat(3,1fr)",
//           },
//           gap: 2,
//         }}
//       >
//         {SUBSCRIPTION_PLANS.map((plan) => (
//           <Card
//             key={plan.id}
//             onClick={() => {
//               if (!plan.comingSoon) {
//                 handleSelectPlan(plan.id);
//               }
//             }}
//             sx={{
//               position: "relative",
//               opacity: plan.comingSoon ? 0.6 : 1,
//               cursor: plan.comingSoon ? "not-allowed" : "pointer",
//               border: "2px solid",
//               borderColor:
//                 formData.plan === plan.id
//                   ? "primary.main"
//                   : "divider",
//               backgroundColor:
//                 formData.plan === plan.id
//                   ? "action.selected"
//                   : "background.paper",
//               transition: "all .25s ease",
//               display: "flex",
//               flexDirection: "column",
//               height: "100%",
//               "&:hover": {
//                 borderColor: "primary.main",
//                 boxShadow: theme.shadows[4],
//               },
//             }}
//           >
//             {plan.recommended && (
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: -12,
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                 }}
//               >
//                 <Chip
//                   label="Recommended"
//                   color="primary"
//                   size="small"
//                 />
//               </Box>
//             )}

//             <CardContent sx={{ flexGrow: 1 }}>
//               <Typography
//                 variant="h6"
//                 fontWeight={600}
//                 gutterBottom
//               >
//                 {plan.name}
//               </Typography>

//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 mb={2}
//               >
//                 {plan.description}
//               </Typography>

//               <List
//                 disablePadding
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 1,
//                 }}
//               >
//                 {plan.features.map((feature, index) => (
//                   <ListItem
//                     key={index}
//                     disableGutters
//                     sx={{
//                       p: 0,
//                       alignItems: "flex-start",
//                       gap: 1,
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         mt: 0.4,
//                         color: "success.main",
//                       }}
//                     >
//                       <CheckCircleIcon fontSize="small" />
//                     </ListItemIcon>

//                     <ListItemText
//                       primary={feature.text}
//                       primaryTypographyProps={{
//                         variant: "body2",
//                       }}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>

//             <CardActions>
//               <Button
//                 fullWidth
//                 disabled={plan.comingSoon}
//                 variant={
//                   formData.plan === plan.id
//                     ? "contained"
//                     : "outlined"
//                 }
//               >
//                 {
//                   plan.comingSoon
//                     ? "Coming Soon"
//                     : formData.plan === plan.id
//                       ? "Selected"
//                       : "Select"
//                 }
//               </Button>
//             </CardActions>
//           </Card>
//         ))}
//       </Box>

      

//       <Box
//         sx={{
//           display: "flex",
//           gap: 2,
//           justifyContent: "flex-end",
//           flexDirection: isMobile
//             ? "column-reverse"
//             : "row",
//         }}
//       >
//         <Button
//           variant="outlined"
//           onClick={onBack}
//           fullWidth={isMobile}
//           disabled={loading}
//         >
//           Back
//         </Button>

//         <Button
//           variant="contained"
//           onClick={handleContinue}
//           disabled={loading}
//           fullWidth={isMobile}
//         >
//           {loading ? "Finishing..." : "Finish Setup"}
//         </Button>
//       </Box>
//     </Stack>
//   );
// }

import { useState, type ReactElement } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Grow,
  Zoom,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { createSubscriptionAPI } from "../../../services/onBoardingService";

import type {
  CreateSubscriptionDTO,
  SubscriptionPlan,
} from "../../../types/subscription";
import ErrorAlert from "../../../components/Error";

interface SubscriptionStepProps {
  onBack: () => void;
  onFinish: () => void;
}

interface SubscriptionFeature {
  text: string;
}

interface SubscriptionPlanCard {
  id: SubscriptionPlan;
  name: string;
  description: string;
  features: SubscriptionFeature[];
  recommended?: boolean;
  comingSoon?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlanCard[] = [
  {
    id: "Free",
    name: "Free",
    description: "Perfect for individuals and small personal workspaces.",
    recommended: true,
    features: [
      { text: "Up to 3 members" },
      { text: "100 Leads & Contacts" },
      { text: "50 Deals" },
      { text: "Basic CRM features" },
      { text: "Email support" },
    ],
  },
  {
    id: "Starter",
    name: "Starter",
    comingSoon: true,
    description: "Ideal for freelancers and small businesses.",
    features: [
      { text: "Up to 10 members" },
      { text: "1,000 Leads & Contacts" },
      { text: "500 Deals" },
      { text: "5,000 Emails" },
      { text: "2,500 SMS & Calls" },
    ],
  },
  {
    id: "Team",
    name: "Team",
    comingSoon: true,
    description: "Designed for growing teams that need more capacity.",
    features: [
      { text: "Up to 50 members" },
      { text: "5,000 Leads & Contacts" },
      { text: "2,000 Deals" },
      { text: "Advanced collaboration" },
      { text: "20,000 Emails" },
    ],
  },
  {
    id: "Business",
    name: "Business",
    comingSoon: true,
    description: "Built for established businesses with large sales teams.",
    features: [
      { text: "Up to 200 members" },
      { text: "20,000 Leads & Contacts" },
      { text: "10,000 Deals" },
      { text: "Priority support" },
      { text: "50,000 Emails" },
    ],
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    comingSoon: true,
    description: "Maximum scale with enterprise-grade limits.",
    features: [
      { text: "Up to 500 members" },
      { text: "100,000 Leads & Contacts" },
      { text: "50,000 Deals" },
      { text: "Dedicated support" },
      { text: "Custom integrations" },
    ],
  },
];

export default function SubscriptionStep({
  onBack,
  onFinish,
}: SubscriptionStepProps): ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<CreateSubscriptionDTO>({
    plan: "Free",
    billing_cycle: "none",
    payment_provider: "none",
    provider_reference: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan): void => {
    setFormData((prev) => ({
      ...prev,
      plan,
    }));
  };

  const handleContinue = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await createSubscriptionAPI(formData);

      console.log("SUBSCRIPTION RESPONSE:", response);

      onFinish();

      console.log("NAVIGATION CALLED");

    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create subscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Collapse in={!!error}>
        <Box sx={{ width: '100%' }}>
          <ErrorAlert message={(error) as string} />
        </Box>
      </Collapse>

      <Box>
        <Typography variant="h5" fontWeight={700} mb={0.75} letterSpacing="-0.01em">
          Choose Your Plan
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Select the plan that best fits your needs. You can always upgrade or
          downgrade later.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(3,1fr)",
          },
          gap: 2,
        }}
      >
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          const selected = formData.plan === plan.id;

          return (
            <Grow in timeout={300 + index * 70} key={plan.id}>
              <Card
                onClick={() => {
                  if (!plan.comingSoon) {
                    handleSelectPlan(plan.id);
                  }
                }}
                elevation={0}
                sx={{
                  position: "relative",
                  opacity: plan.comingSoon ? 0.55 : 1,
                  cursor: plan.comingSoon ? "not-allowed" : "pointer",
                  border: "1.5px solid",
                  borderColor: selected ? "primary.main" : "divider",
                  backgroundColor: selected ? "action.selected" : "background.paper",
                  borderRadius: 2.5,
                  transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  "&:hover": plan.comingSoon
                    ? {}
                    : {
                        borderColor: "primary.main",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(16,24,40,0.08)",
                      },
                }}
              >
                {plan.recommended && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -11,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <Chip
                      label="Recommended"
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </Box>
                )}

                {plan.comingSoon && (
                  <Chip
                    label="Coming soon"
                    size="small"
                    variant="outlined"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontSize: '0.65rem',
                      height: 22,
                      color: "text.secondary",
                      borderColor: "divider",
                    }}
                  />
                )}

                <Zoom in={selected}>
                  <CheckCircleRoundedIcon
                    color="primary"
                    sx={{ position: "absolute", top: 14, right: 14, fontSize: 20 }}
                  />
                </Zoom>

                <CardContent sx={{ flexGrow: 1, pt: plan.recommended ? 3.5 : 2.5 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {plan.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {plan.description}
                  </Typography>

                  <List
                    disablePadding
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {plan.features.map((feature, i) => (
                      <ListItem
                        key={i}
                        disableGutters
                        sx={{ p: 0, alignItems: "flex-start", gap: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mt: 0.4, color: "success.main" }}>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>

                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    fullWidth
                    disabled={plan.comingSoon}
                    disableElevation
                    variant={selected ? "contained" : "outlined"}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                  >
                    {plan.comingSoon ? "Coming Soon" : selected ? "Selected" : "Select"}
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          justifyContent: "flex-end",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        <Button
          variant="outlined"
          onClick={onBack}
          fullWidth={isMobile}
          disabled={loading}
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
          {loading ? "Finishing..." : "Finish Setup"}
        </Button>
      </Box>
    </Stack>
  );
}