import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
        <Typography variant="h6">CRM</Typography>
        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Menu</Button>
          <Button color="inherit">Account</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
};