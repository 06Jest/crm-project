import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        px: 3,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2026 Mini CRM. All rights reserved.
      </Typography>
    </Box>
  );
}