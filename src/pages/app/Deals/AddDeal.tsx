import { useState, useEffect } from "react";
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

import { fetchContactsLists } from "../../../store/contactsSlice";
import {  type DealStage } from '../../../types/deal';
import { addDeal, clearError } from "../../../store/dealsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HandshakeIcon from '@mui/icons-material/Handshake';
import type { Contact } from "../../../types/contact";
import ErrorAlert from "../../../components/Error";
import { useAuth } from "../../../hooks/useAuth";


export default function AddDeal() {
  const { items: contacts, loaded, loading, error} = useSelector((state:RootState) => state.contacts);
  const { loading:  loadingDeals,error: errorDeals} = useSelector((state:RootState) => state.deals);
  const { user, loading: userLoading } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const navigate = useNavigate();
  // const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [form, setForm] = useState({
    contact_id: null,
    title: "",
    stage: 'Prospecting' as DealStage,
    notes: "",
    value: 0,
  });
   

  useEffect(() => {
    if (userLoading || loading) return;

    const loadData = async () => {

      if (user && !loaded) {
        await dispatch(fetchContactsLists()).unwrap();
      }
    };
    loadData();
  }, [userLoading, loaded, loading, user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "contact_id") {
      const contact = contacts.find((c) => c.id === value);

      if (contact) {
        setSelectedContact(contact);
      }
    }
  };

  const handleSubmit = async () => {
    
    if (loadingDeals) return;

    try {
       const newDeal = {
        contact_id: form.contact_id!,
        title: form.title,
        stage: form.stage,
        notes: form.notes,
        value: Number(form.value),
      };

      await dispatch(addDeal(newDeal)).unwrap();
      dispatch(clearError())
      navigate(`/app/deals`);
    } catch {
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
        height: '80vh',
        minHeight: 700,
        width: '80%',
        maxWidth: 1400,
        pt: 2,
      }}
    >
        <Box
          component={Paper}
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: 'column',
            width: '50%',
            minWidth: 450,
            justifyContent: "center",
            p: 3,
            gap: 2,
            borderRadius: 3,
          }}>
          <Button 
            startIcon={<ArrowBackIcon/>}
            onClick={() => {
              dispatch(clearError())
              navigate('/app/deals')
            }}
            sx={{ alignSelf: 'start', ml: '-8px', textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
            Back
          </Button>
           <Box sx={{width: '100%'}}>
              {error || errorDeals  && (
                <ErrorAlert
                  message={error || errorDeals}
                />
              )}
            </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
            <Box sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#eef1f6',
              color: 'primary.main',
            })}>
              <HandshakeIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} letterSpacing={-0.3} lineHeight={1.2}>
                Add Deal
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Log a new opportunity and attach it to a contact
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1.5,
          }}>        
            <TextField
              select
              required
              label="Contact"
              name="contact_id"
              value={selectedContact?.first_name}
              onChange={handleChange}
              size="small"
              fullWidth
              sx={{
                fontSize: 13,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            >
              {contacts.map((contact) => {
                const fullname = `${contact.first_name} ${contact.last_name} ${contact.suffix ? contact.suffix : ''}`
                return (
                <MenuItem key={contact.id} value={contact.id}>
                  {fullname}
                </MenuItem>
                )
              })}
            </TextField>
            <TextField
                required
                label="Value"
                name="value"
                onChange={handleChange}
                size="small"
                fullWidth
                sx={{
                  fontSize: 13,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
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
              required
              label="Title"
              name="title"
              onChange={handleChange}
              size="small"
              multiline
              rows={3}
              fullWidth
              sx={{
                fontSize: 13,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            />
            <TextField
              label="Notes"
              name="notes"
              onChange={handleChange}
              size="small"
              multiline
              rows={3}
              fullWidth
              sx={{
                fontSize: 13,
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            />
          </Box>
          
          <Button
            variant="contained"
            disableElevation
            fullWidth
            disabled={!form.contact_id || !form.title || !form.stage || !form.value}
            onClick={handleSubmit}
            startIcon={<HandshakeIcon />}
            sx={{
              backgroundColor: 'primary.main',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 15,
              py: 1.1,
              borderRadius: 2,
              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
            }}
          >
            Add Deal
          </Button>
          
      </Box >  
    </Box>
  );
}
