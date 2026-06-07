import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";

import {
  Box,
  //Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";

import { addContact } from "../../../store/contactsSlice";
import type { ContactStatus } from "../../../types/contact";

const STATUS_OPTIONS: ContactStatus[] = [
  "Lead",
  "Contacted",
  "Qualified",
  "Opportunity",
  "Customer",
  "Inactive",
  "Lost",
  "Churned",
];

export default function AddContact() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    position: "",
    status: "Lead" as ContactStatus,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {

    const newContact = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      company_name: form.company_name,
      position: form.position,
      status: form.status,
      created_at: new Date().toISOString(),
    };

    await dispatch(addContact(newContact));

    navigate(`/app/contacts`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifySelf: 'center',
        flexDirection: 'column',
        justifyContent: "center",
        height: '100vh',
        width: 500,
      }}
    >
        <Typography variant="h5" fontWeight={700}>
          Add Contact
        </Typography>

        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          justifyContent: "center",
          mt: 4,
        }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
          Personal Details
          </Typography>
          <TextField
            label="First Name"
            name="first_name"
            onChange={handleChange}
          />

          <TextField
            label="Last Name"
            name="last_name"
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            onChange={handleChange}
          />

          <TextField
            label="Phone"
            name="phone"
            onChange={handleChange}
          />
          <TextField
            label="Gender"
            name="gender"
            onChange={handleChange}
          />
          <TextField
            label="Date of Birth"
            name="birthdate"
            onChange={handleChange}
          />
        </Box>
        
        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          justifyContent: "center",
          mt: 4,
        }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
          Professional Details
          </Typography>
          <TextField
            label="Company"
            name="company_name"
            onChange={handleChange}
          />

          <TextField
            label="Department"
            name="department"
            onChange={handleChange}
          />

          <TextField
            label="Position"
            name="position"
            onChange={handleChange}
          />
        </Box>
          
        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          justifyContent: "center",
          mt: 4,
        }}>
          <Typography variant="h5" fontWeight={700} mb={2}>
          Additional Details
          </Typography>

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Priority"
            name="priority"
            onChange={handleChange}
          />

          <TextField
            label="Notes"
            name="notes"
            onChange={handleChange}
          />

        </Box>
          

          <Button
            variant="contained"
            disabled={!form.first_name || !form.email}
            onClick={handleSubmit}
          >
            Create Contact
          </Button>
    </Box>
  );
}