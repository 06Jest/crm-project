import { Tabs, Tab, Box} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

 function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (_:unknown , newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box sx= {{ borderBottom: 1, borderColor: "divider"}}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Dashboard" value="/"/>
        <Tab label="Contacts" value="/contacts"/>
        <Tab label="Leads" value="/leads"/>
      </Tabs>
    </Box>
  );
};

export default Topbar;