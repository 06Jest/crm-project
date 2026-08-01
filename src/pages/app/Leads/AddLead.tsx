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
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import { addLead, clearError } from "../../../store/leadsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ShareIcon from '@mui/icons-material/Share';
import NotesIcon from '@mui/icons-material/Notes';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender, type PreferredTime, type Priority, type Source, type Suffix } from "../../../types/global";
import ErrorAlert from "../../../components/Error";

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Avatar
        sx={{
          width: 34,
          height: 34,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
          color: "primary.main",
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: 16, lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{subtitle}</Typography>
        )}
      </Box>
    </Box>
  );
}

export default function AddLead() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const { loading, error} = useSelector((state:RootState) => state.leads);

  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    suffix: null as Suffix,
    email: null,
    phone: null,
    gender: "Prefer not to say" as Gender,
    birth_date: null,
    industry: "",
    company_name: "",
    department: "",
    position: "",
    website: "",
    source: "Other" as Source,
    priority: "Low" as Priority,
    notes: "",
    facebook: "",
    x: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    telegram: "",
    tiktok: "",
    viber: "",
    preferred_contact_time: "Anytime" as PreferredTime,
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
    if (loading) return;

    if (!form) return;
    try {
      const newLead = {
      title: form.title,
      source: form.source,
      first_name: form.first_name,
      last_name: form.last_name,
      suffix: form.suffix || null,
      gender: form.gender,
      email: form.email || null,
      phone: form.phone || null,
      birth_date: form.birth_date || null,
      industry: form.industry,
      company_name: form.company_name,
      department: form.department,
      position: form.position,
      website: form.website,
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
    await dispatch(addLead(newLead)).unwrap();
    dispatch(clearError());
    navigate(`/app/leads`);
    } catch {
      //Error from state
    }
  };

  const canSubmit = !!form.first_name && !!form.last_name && !!form.title && !!form.notes;

  const fieldSx = {
    fontSize: 13,
    "& .MuiOutlinedInput-root": { borderRadius: 2 },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifySelf: 'center',
        flexDirection: 'column',
        alignItems: "center",
        height: '80vh',
        minHeight: 1400,
        width: '80%',
        maxWidth: 1400,
        pb: 4,
      }}
    >
      <Box sx={{ width: '50%', minWidth: 450, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Button
          startIcon={<ArrowBackIcon/>}
          onClick={() => {
            navigate('/app/leads');
            dispatch(clearError());
          } }
          sx={{ alignSelf: 'start', textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
          Back
        </Button>
      </Box>

      {error && (
        <Box sx={{ width: '50%', minWidth: 450, mt: 1 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
      )}

      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        width: '50%',
        minWidth: 450,
        mt: 2,
        mb: 1,
      }}>
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
            color: "primary.main",
          }}
        >
          <PersonAddAlt1Icon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 0.5, lineHeight: 1.2 }}>
            Add Lead
          </Typography>
        </Box>
      </Box>

        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          width: '50%',
          minWidth: 450,
          justifyContent: "center",
          gap: 2,
        }}>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "divider" }}>
            <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Details" />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                  <TextField
                    label="First Name"
                    name="first_name"
                    required
                    onChange={handleChange}
                    size="small"
                    sx={{
                      ...fieldSx,
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
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                <TextField
                  select
                  label="Suffix"
                  name="suffix"
                  onChange={handleChange}
                  value={form.suffix}
                  size="small"
                  sx={{
                    ...fieldSx,
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
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>

              <TextField
                label="Email"
                name="email"
                onChange={handleChange}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                <TextField
                  select
                  label="Gender"
                  name="gender"
                  onChange={handleChange}
                  value={form.gender}
                  size="small"
                  sx={{
                    ...fieldSx,
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
                    ...fieldSx,
                    width: '50%',
                    '& input' : {
                      colorScheme: themeMode === 'dark' ? 'dark' : 'light', 
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "divider" }}>
            <SectionHeader icon={<WorkOutlineIcon fontSize="small" />} title="Professional Details" />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
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
                      sx={fieldSx}
                    />
                  )}
                />
                <TextField
                  label="Company"
                  name="company_name"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>

              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
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
                      sx={fieldSx}
                    />
                  )}
                  />

                <TextField
                  label="Position"
                  name="position"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>
              <TextField
                  label="Website"
                  name="website"
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  sx={fieldSx}
                />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "divider" }}>
            <SectionHeader
              icon={<ShareIcon fontSize="small" />}
              title="Social & Messaging"
              subtitle="Optional — add any accounts you have on hand"
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                <TextField
                  label="Facebook"
                  name="facebook"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
                <TextField
                  label="X/Twitter"
                  name="x"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>

              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                <TextField
                  label="Tiktok"
                  name="tiktok"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />

                <TextField
                  label="Whatsapp"
                  name="whatsapp"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>

              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                <TextField
                  label="Instagram"
                  name="instagram"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />

                <TextField
                  label="Telegram"
                  name="telegram"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
              }}>
                <TextField
                  label="Linkedin"
                  name="linkedin"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />

                <TextField
                  label="Viber"
                  name="viber"
                  onChange={handleChange}
                  size="small"
                  sx={{
                    ...fieldSx,
                    width: '50%'
                  }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "divider" }}>
            <SectionHeader icon={<NotesIcon fontSize="small" />} title="Additional Details" />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                  label="Title"
                  name="title"
                  required
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  rows={3}
                  sx={fieldSx}
                />
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1.5,
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
                    ...fieldSx,
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
                    ...fieldSx,
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
                    ...fieldSx,
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
                  required
                  onChange={handleChange}
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
                  sx={fieldSx}
                />
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              position: "sticky",
              bottom: 12,
              p: 1.5,
              borderRadius: 3,
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              zIndex: 1200,
            }}
          >
            <Typography sx={{ fontSize: 12, color: "text.secondary", pl: 1 }}>
              {canSubmit ? "Ready to add this lead." : "First name, Last name, title, and notes are required."}
            </Typography>
            <Button
              variant="contained"
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
              disableElevation
              sx={{
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1,
                boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
              }}
            >
              {loading ? "Adding…" : "Add Lead"}
            </Button>
          </Paper>
          
      </Box >  
    </Box>
  );
}