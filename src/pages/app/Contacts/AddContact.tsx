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
  Autocomplete,
} from "@mui/material";

import { addContact, clearError } from "../../../store/contactsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { type AddContact, type ContactStatus} from "../../../types/contact";
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender,  type PreferredTime,  type Priority, type Source, type Suffix } from "../../../types/global";
import ErrorAlert from "../../../components/Error";

export default function AddContact() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
   const { loading, error} = useSelector((state:RootState) => state.contacts);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    suffix: null as Suffix,
    email: null,
    phone: null,
    gender: "Prefer not to say" as Gender,
    birth_date: null,
    industry: "",
    department: "",
    website: "",
    company_name: "",
    position: "",
    source: "Other" as Source,
    status: "Contacted" as ContactStatus,
    priority: "Low" as Priority,
    preferred_contact_time: "Anytime" as PreferredTime,
    notes: "",
    facebook: "",
    x: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    telegram: "",
    tiktok: "",
    viber: "",
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
    if (loading) return;

    try {
      const newContact = {
        first_name: form.first_name,
        last_name: form.last_name,
        suffix: form.suffix,
        email: form.email!,
        phone: form.phone!,
        gender: form.gender,
        birth_date: form.birth_date || null,
        industry: form.industry,
        department: form.department,
        company_name: form.company_name,
        position: form.position,
        website: form.website,
        source: form.source,
        status: form.status,
        priority: form.priority,
        preferred_contact_time: form.preferred_contact_time,
        notes: form.notes,
        facebook: form.facebook,
        x: form.x,
        whatsapp: form.whatsapp,
        linkedin: form.linkedin,
        instagram: form.instagram,
        telegram: form.telegram,
        tiktok: form.tiktok,
      viber: form.viber,
      };

      await dispatch(addContact(newContact)).unwrap();

      navigate("/app/contacts");
    } catch  {
      //Error in state
    }
  };
    

  return (
    <Box
      sx={{
        display: "flex",
        justifySelf: 'center',
        flexDirection: 'column',
        alignItems: "center",
        height: 1100,
        minHeight: 700,
        width: '80%',
        maxWidth: 1400,
      }}
    >
      <Button 
        startIcon={<ArrowBackIcon/>}
        onClick={() => {
          dispatch(clearError());
          navigate('/app/contacts')
        } }
        sx={{ alignSelf: 'start'}}>
        Back
      </Button>
      <Box sx={{alignSelf: 'center'}}>
        {error && (
        <ErrorAlert
          message={error}
        />
      )}
      </Box>
      
        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          width: '50%',
          minWidth: 450,
          justifyContent: "center",
          p: 2,
          gap: 1,
        }}>
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 2, mb: 2, ml: '-100px', mt: '-20px' }}>
          ADD CONTACT
          </Typography>
          <Typography variant="h6" fontWeight={700}>
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
              select
              label="Suffix"
              name="suffix"
              onChange={handleChange}
              value={form.suffix}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
              slotProps={{
                select: {
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                      },
                    },
                  },
                },
              }}
            >
            {SUFFIXES.map((suffix) => (
                <MenuItem key={suffix} value={suffix}>
                  {suffix}
                </MenuItem>
              ))}
            </TextField>
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
            {GENDERS.map((gender) => (
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
          <Typography variant="h6" fontWeight={700} mt={2}>
            Professional Details
          </Typography>
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
            <Autocomplete
              freeSolo
              sx={{ width: '50%' }}
              options={INDUSTRIES}
              value={form.industry}
              onChange={(_, value) => {
                setForm(prev => ({
                  ...prev,
                  industry: value ?? '',
                }));
              }}
              onInputChange={(_, value) => {
                setForm(prev => ({
                  ...prev,
                  industry: value,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Industry"
                  size="small"
                />
              )}
            />
            
             <TextField
              label="Company"
              name="company_name"
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
            <Autocomplete
              freeSolo
              sx={{ width: '50%' }}
              options={DEPARTMENTS}
              value={form.department}
              onChange={(_, value) => {
                setForm(prev => ({
                  ...prev,
                  department: value ?? '',
                }));
              }}
              onInputChange={(_, value) => {
                setForm(prev => ({
                  ...prev,
                  department: value,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  size="small"
                />
              )}
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
          <TextField
              label="Website Url"
              name="website"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '100%'
              }}
            />
          <Typography variant="h6" fontWeight={700} mt={2}>
            Social and Messaging Accounts
          </Typography>
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>
            <TextField
              label="Facebook"
              name="facebook"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
            <TextField
              label="X/Twitter"
              name="x"
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
              label="Tiktok"
              name="tiktok"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />

            <TextField
              label="Whatsapp"
              name="whatsapp"
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
              label="Instagram"
              name="instagram"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />

            <TextField
              label="Telegram"
              name="telegram"
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
              label="Linkedin"
              name="linkedin"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />

            <TextField
              label="Viber"
              name="viber"
              onChange={handleChange}
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
          </Box>
          <Typography variant="h6" fontWeight={700} mt={2}>
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
                width: '40%'
              }}
              slotProps={{
                select: {
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                      },
                    },
                  },
                },
              }}
            >
              {SOURCES.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Preferred Time"
              name="preferred_contact_time"
              onChange={handleChange}
              value={form.preferred_contact_time}
              size="small"
              sx={{
                fontSize: 13,
                width: '30%'
              }}
            >
              {PREFERRED_CONTACT_TIMES.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
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
                width: '30%'
              }}
            >
              {PRIORITIES.map((prio) => (
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