import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { type RootState } from "../../../store/store";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { fetchContactsLists } from "../../../store/contactsSlice";
import {  type DealStage } from '../../../types/deal';
import { addDeal, clearError } from "../../../store/dealsSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PersonIcon from '@mui/icons-material/Person';
import ErrorAlert from "../../../components/Error";
import { useAuth } from "../../../hooks/useAuth";
import { formatName } from "../../../utils/formatText";


export default function AddDealByID() {
  const { id } = useParams<{id: string }>();
  const contact = useSelector((state: RootState) =>
    state.contacts.items.find((c) => c.id === id)
  );
  const { loading, error} = useSelector((state:RootState) => state.deals);
  const { user, loading: userLoading } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  // const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [form, setForm] = useState({
    title: "",
    stage: 'Prospecting' as DealStage,
    notes: "",
    value: 0,
  });
   

  useEffect(() => {
    if (userLoading ) return;

    const loadData = async () => {

      if (user ) {
        await dispatch(fetchContactsLists()).unwrap();
      }
    };
    loadData();
  }, [userLoading, user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (submitting || loading) return;
    if (!id) return;
    setSubmitting(true);
    try {
       const newDeal = {
        contact_id: id,
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
              navigate(`/app/contacts/${id}`)
            }}
            sx={{ alignSelf: 'start', ml: '-8px', textTransform: 'none', fontWeight: 600, color: 'primary.main' }}>
            Back
          </Button>
          <Box sx={{width: '100%'}}>
            {error &&(
              <ErrorAlert
                message={error }
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
                Create a new opportunity for this contact
              </Typography>
            </Box>
          </Box>

          <Box sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1,
            px: 1.5,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#242424' : '#f4f5f7',
            border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
          })}>
            <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
                Contact
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {formatName(contact?.first_name, contact?.last_name)}
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
              disabled
              label= {formatName(contact?.first_name, contact?.last_name)}
              name="contact_id"
              size="small"
              sx={{
                fontSize: 13,
                width: '50%',
                display: 'none',
              }}
            />
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
            disabled={ !form.title || !form.stage || !form.value || submitting}
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
            {submitting ? "Adding…" : "Add deal"}
          </Button>
          
      </Box >  
    </Box>
  );
}
