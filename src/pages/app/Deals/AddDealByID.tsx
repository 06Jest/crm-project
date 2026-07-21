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
    if (!id) return;
    if (loading) return;

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
      }}
    >
        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          width: '50%',
          minWidth: 450,
          justifyContent: "center",
          p: 2,
          gap: 1,
        }}>
          <Button 
            startIcon={<ArrowBackIcon/>}
            onClick={() => {
              dispatch(clearError())
              navigate(`/app/contacts/${id}`)
            }}
            sx={{ alignSelf: 'start', ml: '-40px'}}>
            Back
          </Button>
          <Box sx={{width: '100%'}}>
            {error &&(
              <ErrorAlert
                message={error }
              />
            )}
          </Box>
          <Typography variant="h5" fontWeight={700}>
          Add Deal
          </Typography>
          
          <Box sx={{
            display: "flex",
            width: '100%',
            justifyContent: "space-between",
            gap: 1,
          }}>        
            <TextField
              disabled
              label= {formatName(contact?.first_name, contact?.last_name)}
              name="contact_id"
              size="small"
              sx={{
                fontSize: 13,
                width: '50%'
              }}
            />
            <TextField
                required
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
              required
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
              disabled={ !form.title || !form.stage || !form.value}
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