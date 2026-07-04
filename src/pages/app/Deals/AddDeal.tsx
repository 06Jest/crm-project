import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../../store/store";
import { supabase } from "../../../services/supabase";

import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";

import { fetchContacts } from "../../../store/contactsSlice";
import type { DealStage } from '../../../types/deal';
import { addDeal } from "../../../store/dealsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Contact } from "../../../types/contact";

const STAGES: DealStage[] = [
  'Prospecting',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];


export default function AddContact() {
  const { items: contacts, loaded} = useSelector((state:RootState) => state.contacts);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const navigate = useNavigate();
  // const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [form, setForm] = useState({
    contact_id: "",
    title: "",
    stage: 'Prospecting' as DealStage,
    notes: "",
    value: 0,
  });

  useEffect(() => {
    if (loaded) return;
  
    let mounted = true;
  
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
  
        if (!mounted) return;
  
        const token = session?.access_token;
  
        if (token) {
          dispatch(fetchContacts(token));
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    load();
  
    return () => {
      mounted = false;
    };
  }, [loaded, dispatch]);

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

    const newDeal = {
      contact_id: form.contact_id,
      title: form.title,
      stage: form.stage,
      notes: form.notes,
      value: form.value,
    };
    console.log(newDeal);

    await dispatch(addDeal(newDeal));

    navigate(`/app/deals`);
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
        onClick={() => navigate('/app/deals')}
        sx={{ alignSelf: 'start'}}>
        Back to deals
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
          Add Deal
          </Typography>
          <TextField
            select  
            label="Contact"
            name="contact_id"
            value={selectedContact?.first_name}
            // value={`${selectedContact?.first_name} ${selectedContact?.last_name} ${selectedContact?.suffix}`}
            onChange={handleChange}
            size="small"
            sx={{
              fontSize: 13,
              width: '50%'
            }}
          >
            {contacts.map((contact) => {
              const fullname = `${contact.first_name} ${contact.last_name} ${contact.suffix}`
              return (
              <MenuItem key={contact.id} value={contact.id}>
                {fullname}
              </MenuItem>
              )
            })}
          </TextField>
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>        
            
            <TextField
              select
              label="Stage"
              name="stage"
              value={form.stage}
              onChange={handleChange}
              size="small"
              fullWidth
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            >
              {STAGES.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Value"
              name="value"
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
              label="Title"
              name="title"
              onChange={handleChange}
              size="small"
              multiline
              rows={3}
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
            <TextField
              label="Notes"
              name="notes"
              onChange={handleChange}
              size="small"
              multiline
              rows={3}
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
          </Box>
          
          <Paper>
            <Button
              variant="contained"
              fullWidth
              disabled={!form.contact_id || !form.title || !form.stage || !form.value}
              onClick={handleSubmit}
              sx={{
                backgroundColor: 'primary.main'
              }}
            >
              Add Deal
            </Button>
          </Paper>
          
      </Box >  
    </Box>
  );
}