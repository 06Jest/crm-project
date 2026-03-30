import { getContacts, addContact, updateContact, deleteContact } from '../../services/contactService';
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import type { Contact } from '../../types/contact';

import {
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  TableCell
} from "@mui/material";

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(getContacts())
  const [open, setOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)

  const [form, setForm] = useState<{name: string; email: string; phone: string; status: "active" | "Prospect" | "Lead"}>({

    name: "",
    email: "",
    phone: "",
    status: "active"
  })

  const handleOpen = (contact?: Contact) => {
    if(contact) {
      setEditingContact(contact)
      setForm({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || "",
        status: contact.status
      })
    } else {
      setEditingContact(null)
      setForm({
        name: "",
        email: "",
        phone: "",
        status: "active"
      })
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
      updateContact({
        ...editingContact,
        ...form
      })
    } else {
        addContact({
          id: uuidv4(),
          ...form
        })
      }
    
      setContacts(getContacts())
      handleClose()
    }
    const handleDelete = (id: string) => {
      deleteContact(id)
      setContacts(getContacts())
    }

    return (
      <Box>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          >
            Add Contact
        </Button>

        <TableContainer component = {Paper} sx={{ mt: 2 }}>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key ={contact.id}>
                  <TableCell>{contact.name}</TableCell>
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
              width: 400,
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
                <MenuItem value="active">active</MenuItem>
                <MenuItem value="Prospect">prospect</MenuItem>
                <MenuItem value="Lead">lead</MenuItem>
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

    )
}
