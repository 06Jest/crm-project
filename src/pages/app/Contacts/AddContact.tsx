import { useEffect, useRef, useState } from "react";
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
  Fade,
  Collapse,
} from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";

import { addContact, clearError } from "../../../store/contactsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ShareIcon from '@mui/icons-material/Share';
import NotesIcon from '@mui/icons-material/Notes';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { type AddContact, type ContactStatus} from "../../../types/contact";
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender,  type PreferredTime,  type Priority, type Source, type Suffix } from "../../../types/global";
import ErrorAlert from "../../../components/Error";

const fieldSx = {
  fontSize: 13,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    transition: "background-color 0.2s ease",
  },
};

function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useRevealOnScroll();
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          opacity: 1,
          transform: "none",
        },
      }}
    >
      {children}
    </Box>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Avatar
        sx={{
          width: 34,
          height: 34,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.3, letterSpacing: 0.1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>{subtitle}</Typography>
        )}
      </Box>
    </Box>
  );
}

const sectionPaperSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 3,
  borderColor: "divider",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:focus-within": {
    borderColor: "primary.main",
    boxShadow: (theme: Theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
};


export default function AddContact() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting || loading) return;

    setIsSubmitting(true);
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
    } finally {
    setIsSubmitting(false);
  }
  };

  const canSubmit = !!form.first_name && !!form.email && !!form.last_name && !!form.phone;

  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
          pb: { xs: 4, sm: 5 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button
            startIcon={<ArrowBackIcon/>}
            onClick={() => {
              dispatch(clearError());
              navigate('/app/contacts')
            } }
            sx={{ alignSelf: 'start', textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
            Back
          </Button>
        </Box>

        <Collapse in={!!error} unmountOnExit>
          <Box sx={{ mt: 1 }}>
            <ErrorAlert
              message={error ?? ""}
            />
          </Box>
        </Collapse>

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mt: 2.5,
          mb: 3,
        }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
            }}
          >
            <PersonAddAlt1Icon />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ letterSpacing: 0.3, lineHeight: 1.2, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
            >
              Add Contact
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: 'column', gap: 2.5 }}>

          <RevealSection delay={0}>
            <Paper variant="outlined" sx={sectionPaperSx}>
              <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Details" />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    <TextField
                    label="First Name"
                    name="first_name"
                    required
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />

                  <TextField
                    label="Last Name"
                    name="last_name"
                    required
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    select
                    label="Suffix"
                    name="suffix"
                    onChange={handleChange}
                    value={form.suffix}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
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
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
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
                  fullWidth
                  sx={fieldSx}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    onChange={handleChange}
                    value={form.gender}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
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
                      flex: "1 1 200px",
                      minWidth: 0,
                      '& input' : {
                        colorScheme: themeMode === 'dark' ? 'dark' : 'light',
                      }
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </RevealSection>

          <RevealSection delay={60}>
            <Paper variant="outlined" sx={sectionPaperSx}>
              <SectionHeader icon={<WorkOutlineIcon fontSize="small" />} title="Professional Details" />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <Autocomplete
                    freeSolo
                    sx={{ flex: "1 1 200px", minWidth: 0 }}
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
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <Autocomplete
                    freeSolo
                    sx={{ flex: "1 1 200px", minWidth: 0 }}
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
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>
                <TextField
                    label="Website Url"
                    name="website"
                    onChange={handleChange}
                    size="small"
                    fullWidth
                    sx={fieldSx}
                  />
              </Box>
            </Paper>
          </RevealSection>

          <RevealSection delay={120}>
            <Paper variant="outlined" sx={sectionPaperSx}>
              <SectionHeader
                icon={<ShareIcon fontSize="small" />}
                title="Social & Messaging"
                subtitle="Optional, add any accounts you have on hand"
              />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    label="Facebook"
                    name="facebook"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                  <TextField
                    label="X/Twitter"
                    name="x"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    label="Tiktok"
                    name="tiktok"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />

                  <TextField
                    label="Whatsapp"
                    name="whatsapp"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    label="Instagram"
                    name="instagram"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />

                  <TextField
                    label="Telegram"
                    name="telegram"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    label="Linkedin"
                    name="linkedin"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />

                  <TextField
                    label="Viber"
                    name="viber"
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 200px", minWidth: 0 }}
                  />
                </Box>
              </Box>
            </Paper>
          </RevealSection>

          <RevealSection delay={180}>
            <Paper variant="outlined" sx={sectionPaperSx}>
              <SectionHeader icon={<NotesIcon fontSize="small" />} title="Additional Details" />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <TextField
                    select
                    label="Source"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    size="small"
                    sx={{ ...fieldSx, flex: "1 1 180px", minWidth: 0 }}
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
                    sx={{ ...fieldSx, flex: "1 1 150px", minWidth: 0 }}
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
                    sx={{ ...fieldSx, flex: "1 1 150px", minWidth: 0 }}
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
                    fullWidth
                    sx={fieldSx}
                  />
              </Box>
            </Paper>
          </RevealSection>

          <Paper
            variant="outlined"
            sx={{
              position: "sticky",
              bottom: { xs: 8, sm: 12 },
              p: 1.5,
              borderRadius: 3,
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 -2px 12px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: 1, sm: 2 },
              zIndex: 1200,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                pl: { xs: 0.5, sm: 1 },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {canSubmit ? "Ready to add this contact." : "First name, last name, email, and phone are required."}
            </Typography>
            <Button
              variant="contained"
              disabled={!canSubmit || loading || isSubmitting}
              onClick={handleSubmit}
              disableElevation
              sx={{
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1,
                width: { xs: "100%", sm: "auto" },
                boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                transition: "box-shadow 0.15s ease, transform 0.1s ease",
                "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.22)" },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              {loading || isSubmitting ? "Adding…" : "Add Contact"}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
}