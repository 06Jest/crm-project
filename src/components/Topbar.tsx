import { Tabs, Tab, Box} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonIcon from '@mui/icons-material/Person';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

 function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (_:unknown , newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box  sx= {{ mt: 8, position: 'fixed', left: 0, right: 0, borderBottom: 1,zIndex: 2, borderColor: "divider", display: 'flex', justifyContent: "center"}}>
      <Tabs value={value} onChange={handleChange}>
        <Tab title="Dashboard" label={<DashboardIcon />} value="/app/dashboard"/>
        <Tab title="Contacts" label={<ContactsIcon />} value="/app/contacts"/>
        <Tab title="Leads" label={<FolderSharedIcon />} value="/app/leads"/>
        <Tab title="Deals" label={<HandshakeIcon />} value="/app/deals"/>
        <Tab title="Activities" label={<ViewTimelineIcon />} value="/app/activities"/>
        <Tab title="Customers" label={<PersonIcon />} value="/app/customers"/>
      </Tabs>
    </Box>
  );
};

export default Topbar;