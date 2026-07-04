import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../../store/store";


import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";

import { addContact } from "../../../store/contactsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { ContactStatus, Gender, Priority, ContactSource } from "../../../types/contact";

const STATUS_OPTIONS: ContactStatus[] = [
  "Contacted",
  "Qualified",
  "Opportunity",
  "Customer",
  "Inactive",
  "Lost",
  "Churned",
];

const SOURCE_OPTIONS: ContactSource[] = [
  "Website",
  "Referral",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Google Search",
  "Google Ads",
  "Email Campaign",
  "Cold Call",
  "Trade Show",
  "Webinar",
  "Partner",
  "Walk-in",
  "WhatsApp",
  "Messenger",
  "Personal Network",
  "Direct Conversation",
  "Networking Event",
  "Conference",
  "Friend",
  "Family",
  "Other",
]

const GENDER: Gender[] = [
  "Male",
  "Female",
  "Prefer not to say",
];
const PRIORITY: Priority[] = [
  "Highest",
  "High",
  "Low",
];

export default function AddContact() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    suffix: "",
    email: "",
    phone: "",
    gender: "Prefer not to say" as Gender,
    birth_date: null,
    company_name: "",
    position: "",
    source: "Other" as ContactSource,
    status: "Contacted" as ContactStatus,
    priority: "Low" as Priority,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      })
  };

  const handleSubmit = async () => {
    const birthday =
      form.birth_date === ''
        ? null
        : form.birth_date;

    const newContact = {
      first_name: form.first_name,
      last_name: form.last_name,
      suffix: form.suffix,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      birth_date: birthday,
      company_name: form.company_name,
      position: form.position,
      source: form.source,
      status: form.status,
      created_at: new Date().toISOString(),
      priority: form.priority,
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
        alignItems: "center",
        height: '80vh',
        minHeight: 700,
        width: '80%',
        maxWidth: 1400,
        mt: 5,
      }}
    >
      <Button 
        startIcon={<ArrowBackIcon/>}
        onClick={() => navigate('/app/contacts')}
        sx={{ alignSelf: 'start'}}>
        Back to contacts
      </Button>

        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          width: '50%',
          minWidth: 450,
          justifyContent: "center",
          p: 2,
          gap: 1,
        }}>
          <Typography variant="h5" fontWeight={700}>
          Personal Details
          </Typography>
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
              <TextField
              label="First Name"
              name="first_name"
              required
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />

            <TextField
              label="Last Name"
              name="last_name"
              required
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
          </Box>
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
            <TextField
              label="Suffix"
              name="suffix"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />

            <TextField
              label="Phone"
              name="phone"
              required
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
          </Box>
          
          <TextField
            type="email"
            label="Email"
            name="email"
            required
            value={form.email}
            error={form.email.length > 0 && form.email.length < 3}
            onChange={handleChange}
            size="small"
            sx={{
              fontSize: 13,
            }}
          />
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
            <TextField
              select
              label="Gender"
              name="gender"
              onChange={handleChange}
              value={form.gender}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%',
              }}
            >
            {GENDER.map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
            </TextField>
            <TextField
              label="Date of Birth"
              name="birth_date"
              type="date"
              onChange={handleChange}
              slotProps={{ inputLabel: { shrink: true } }}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%',
                '& input' : {
                  colorScheme: themeMode === 'dark' ? 'dark' : 'light', 
                }
              }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700} mt={2}>
            Professional Details
          </Typography>
          <TextField
            label="Company"
            name="company_name"
            onChange={handleChange}
            size="small"
            sx={{
              fontSize: 13,
            }}
          />
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
            <TextField
              label="Department"
              name="department"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />

            <TextField
              label="Position"
              name="position"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
          </Box>
          <Typography variant="h5" fontWeight={700} mt={2}>
            Additional Details
          </Typography>
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
            <TextField
              select
              label="Source"
              name="source"
              value={form.source}
              onChange={handleChange}
              size="small"
              fullWidth
              sx={{
                fontSize: 13,
              }}
            >
              {SOURCE_OPTIONS.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Priority"
              name="priority"
              onChange={handleChange}
              value={form.priority}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            >
              {PRIORITY.map((prio) => (
                <MenuItem key={prio} value={prio}>
                  {prio}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
              label="Notes"
              name="notes"
              onChange={handleChange}
              size="small"
              multiline
              rows={3}
              sx={{
                fontSize: 13,
              }}
            />
          <Paper>
            <Button
              variant="contained"
              fullWidth
              disabled={!form.first_name || !form.email || !form.last_name || !form.phone}
              onClick={handleSubmit}
              sx={{
                backgroundColor: 'primary.main'
              }}
            >
              Add Contact
            </Button>
          </Paper>
          
      </Box >  
    </Box>
  );
}