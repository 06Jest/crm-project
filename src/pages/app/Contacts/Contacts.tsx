import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useAuthContext } from '../../../hooks/useAuthContext'

import { 
  addContact,
  updateContact,
  deleteContact,
  fetchContacts
} from "../../../store/contactsSlice"

import { useState, useEffect } from "react";
import type { Contact } from '../../../types/contact';
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Alert,
  CircularProgress,
  Typography
} from "@mui/material";


type FormState = {
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Prospect' | 'Lead'; 
};

const emptyForm: FormState = {name: '', email: '', phone: '', status: 'Active'};

export default function Contacts() {
  const { items: contacts, loading, error} = useSelector((state:RootState) => state.contacts);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(()=> {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleOpen = (contact?: Contact) => {
    if(contact) {
      setEditingContact(contact)
      setForm({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        status: contact.status
      })
    } else {
      setEditingContact(null)
      setForm(emptyForm);
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
  if (editingContact) {
    dispatch(updateContact({ ...editingContact, ...form }));
  } else {
    dispatch(addContact({
      ...form,
      user_id: user?.id || '',
    }));
  }
  handleClose();
};

  const handleDelete = (id: string) => {
    dispatch(deleteContact(id))
  }


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
    return (
      <Box>
         {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
         )}
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>Contacts</Typography>
            <Button
            variant="contained"
            onClick={() => handleOpen()}
            >
              Add Contact
            </Button>
         </Box>
        

        <TableContainer component = {Paper} sx={{ mt: 2, maxWidth: 1200, margin: "0 auto" }}>
          <Table>

            <TableHead sx={{ justifyContent: "space-between" }}>
              <TableRow sx={{
                    "& .MuiTableCell-root": {
                      textAlign: "center"
                    }
                  }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key ={contact.id} hover
                  sx={{
                    "& .MuiTableCell-root": {
                      textAlign: "center"
                    }
                  }}
                >
                  <TableCell
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                  onClick={() => navigate(`/app/contacts/${contact.id}`)}
                  >{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpen(contact)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDelete(contact.id)} 
                      >
                        Delete
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
              {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No contacts yet. Add your first one!
                </TableCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editingContact ? "Edit Contact" : "Add Contact"}
          </DialogTitle>

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              width: 300,
            }}
            >
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <TextField
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                select
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="Prospect">Prospect</MenuItem>
                <MenuItem value="Lead">Lead</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={handleSubmit}
                >
                  {editingContact ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
      </Box>
    );
}
