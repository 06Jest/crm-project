import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { supabase } from "../../../services/supabase";
import { formatDistanceToNow } from 'date-fns';
import { DataGrid, type GridColDef, useGridApiRef, type GridRowSelectionModel } from '@mui/x-data-grid';
import { useSidebar } from "../../../hooks/useSidebar";




import ErrorAlert from "../../../components/Error";
import { alpha } from '@mui/material/styles';
import { 
  // addContact,
  // updateContact,
  deleteContact,
  fetchContacts
} from "../../../store/contactsSlice";
// import { useState} from "react";
import { useEffect } from "react";
// import type { Contact } from '../../../types/contact';
import { useNavigate } from "react-router-dom";


import {
  Box,
  Button,
  // Table,
  // TableBody,
  // TableContainer,
  // TableHead,
  // TableRow,
  // TableCell,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  // DialogActions,
  // MenuItem,
  // Grid,
  // Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Snackbar,
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import type { ContactStatus } from "../../../types/contact";
import { useState } from "react";
// import { useSidebar } from "../../../hooks/useSidebar";

// type FormState = {
//   name: string;
//   email: string;
//   phone: string;
//   company_name: string;
//   assigned_to: string;
//   position?: string;
//   created_at?: string;
//   status:   
//   | "Lead"
//   | "Contacted"
//   | "Qualified"
//   | "Opportunity"
//   | "Customer"
//   | "Inactive"
//   | "Lost"
//   | "Churned";
// };

// const emptyForm: FormState = {name: '', email: '', phone: '', status: 'Lead',assigned_to: '', company_name: ''};



const STATUS_COLORS: Record<ContactStatus, string> = {
  Lead: '#96969670',
  Contacted: '#ffffff',
  Qualified: '#facd91',
  Opportunity: '#AD7450',
  Customer: '#ffbb29',  
  Inactive: '#e65454',
  Lost: '#7a0000',
  Churned: '#000000',
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    sortable: true,
    flex: 1,
    renderCell: (params) => (
    <Typography sx={{display: 'flex', alignItems: 'center', height: '100%'}} color="primary">
      {params.value}
    </Typography>
    ),
  },
  { field: 'email', headerName: 'Email', flex: 1,},
  { field: 'phone', headerName: 'Phone', flex: 1, },
  { field: 'status', 
    headerName: 'Status', 
    flex: 1,
    display: 'flex',
    align: 'left',
    renderCell: ({ value }) => (
      <Box sx={{
        my: '-2px', 
        px: 2, py: '1px', 
        border: '1px solid #05050541',  
        borderRadius: 3, 
        color: value === 'Churned' || value === 'Lost' ? 'white' : 'black',
        backgroundColor: STATUS_COLORS[value as ContactStatus]}}>
        {value}
    </Box>
    ),
  },
  { field: 'owner_name', headerName: 'Owner', width: 300 },
  {
    field: 'created_at',
    headerName: 'Created',
    flex: 1,
    valueGetter: (value) =>
      value
        ? formatDistanceToNow(new Date(value), {
            addSuffix: true,
          })
        : '',
  },
];

const paginationModel = { page: 0, pageSize: 10 };


export default function Contacts() {
  const { items: contacts, loading, loaded, error} = useSelector((state:RootState) => state.contacts);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { collapsed } = useSidebar();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const apiRef = useGridApiRef();
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const { collapsed } = useSidebar();
  // const { user } = useAuthContext();
  // const [open, setOpen] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);
  // const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  // const [editingContact, setEditingContact] = useState<Contact | null>(null)
  // const [form, setForm] = useState<FormState>(emptyForm);

  const rows = contacts.map(contact => ({
    id: contact.id,
    name: `${contact.first_name} ${contact.last_name}`,
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
    owner_name: contact.owner_name,
    created_at: contact.created_at,
  }));

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
  
const recentContacts = [...contacts]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .slice(0, 10);

const recentContactsList = recentContacts.map(contact => ({
  name: `${contact.first_name} ${contact.last_name}`,
  id: contact.id,
  created: contact.created_at
    ? formatDistanceToNow(new Date(contact.created_at), {
        addSuffix: true,
      })
    : '',
}));



  // const handleOpen = (contact?: Contact) => {
  //   if(contact) {
  //     setEditingContact(contact)
  //     setForm({
  //       name: contact.name,
  //       email: contact.email,
  //       phone: contact.phone,
  //       status: contact.status,
  //       position: contact.position || 'not provided',
  //       assigned_to: contact.assigned_to || '',
  //       company_name: contact.company_name || 'not provided',
  //     })
  //   } else {
  //     setEditingContact(null)
  //     setForm(emptyForm);
  //   }
  //   setOpen(true)
  // }


  // const handleClose = () => {
  //   setOpen(false)
  // }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = () => {
//   if (editingContact) {
//     const { id, ...rest } = editingContact;

//     dispatch(
//       updateContact({
//         id,
//         contact: {
//           ...rest,
//           ...form,
//         },
//       })
//     );
//   } else {
//     dispatch(addContact({ ...form }));
//   }

//   handleClose();
// };

  // const handleOpenDelete = (contact: Contact) => {
  // setSelectedContact(contact); 
  // setOpenDelete(true);
  // };
  // const handleCloseDelete = () => {
  //   setOpenDelete(false);
  // } 

  // const handleDelete = (id: string) => {
  //   dispatch(deleteContact(id))
  // }


  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8,  }}>
        <CircularProgress />
      </Box>
    );
  }
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexDirection: 'rows', 
        p: 2,
        mx: 5,
        height: '90vh'}}>
         {error && (
          <Box  sx={{ 
            position: 'absolute', 
            zIndex: 10000,
            left: '50%',
            top: 10,
            transform: 'translateX(-50%)'}}>
            <ErrorAlert title="Error" message={error}/>
          </Box>
         )}

          <Box sx={{display: 'flex', flexDirection: 'column',  width: '15%', alignItems: 'end', minWidth: 250}}>
            <Paper sx={{ height: '50%', maxHeight: 325, width: '100%', m: 1, p: 1, borderRadius: 3,}}>
              <Typography  sx={{
                pb: 1,
                borderBottom: 0.2, 
                borderColor: '#92929238'
              }} variant="h6" fontWeight={700} margin={1} marginLeft={1}>Recently Added</Typography>
              <List>
                {recentContactsList.map((contact) => (
                  <ListItem key={contact.id} onClick={() => navigate(`/app/contacts/${contact.id}`)} sx={{
                        cursor: 'pointer',
                        height: 15,
                        py: 1.4,
                        borderRadius: 4,
                        '&:hover': {
                          bgcolor: (theme) =>
                          alpha(theme.palette.text.primary, 0.08),
                        },}}>
                    <ListItemText
                      primary={contact.name}
                      primaryTypographyProps={{color: "primary", fontSize: 14 }}
                      sx={{textAlign: 'left'}}
                    />
                    <ListItemText
                      sx={{textAlign: 'right'}}
                      primaryTypographyProps={{ fontSize: 11}}
                      primary={contact.created}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Paper onClick={() => setOpenSnackbar(true)} sx={{ height: '50%',maxHeight: 325, width: '100%', minWidth: 200, m: 1, p: 1, borderRadius: 3, opacity: 0.5}}>
              <Typography sx={{
                pb: 1,
                borderBottom: 0.2, 
                borderColor: '#92929238'
              }} variant="h6" fontWeight={700} margin={1} marginLeft={1}>Priorities</Typography>
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '70%'}}>
                <LockIcon fontSize="large"/>
              </Box>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message="Coming Soon!"
              />
            </Paper>
          </Box>
          <Paper
            sx={{
              justifyContent: 'center',
              p: 1,
              pt: 0,
              maxWidth: collapsed ? 1400 : 1200,
              transition: "width 0.5s ease",
              maxHeight:  690,
              flex: 1,
              borderRadius: 3,
              marginLeft: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{display: 'flex', justifyContent: 'space-between', p: 2}}>
              <Typography variant="h5" fontWeight={700} margin={1} >Contacts</Typography>
              <Box sx={{
                display: 'flex',
                width: '50%',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Button 
                onClick={() => navigate(`/app/addcontact`)}
                sx={{
                  fontSize: 12,
                  py: 1,
                  px: 3,
                  border: '1px solid #81818188',
                  borderRadius: 3,
                  mr: 2,
                  fontWeight: 700
                }}>Add Contacts</Button>
                <TextField
                  sx={{
                    flex: 1,
                    borderRadius: 5
                  }}
                  size="small"
                  placeholder="Search feature coming soon..."
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon/>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
              <Button
                  sx={{ borderRadius: 20 }}
                onClick={() => setConfirmOpen(true)}
                disabled={selectedRows.ids.size === 0}
              >
                <DeleteIcon 
                sx={{
                  opacity: selectedRows.ids.size > 0 ? 1 : 0,
                }}
                color="error"
                fontSize="large" />
              </Button>
            </Box>
            
            <DataGrid
              sx={{
                flex: 1,
                width: '100%',
                height: 600,
                borderRadius: 3,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10, 15]}
              rowHeight={35}
              checkboxSelection
              apiRef={apiRef}
              onRowSelectionModelChange={(ids) => {
                setSelectedRows(ids);
              }}
              onRowClick={(contact) => {
                navigate(`/app/contacts/${contact.id}`);
              }}
            />
            
          </Paper>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>

            <DialogContent>
              Are you sure you want to delete {selectedRows.ids.size} contact(s)?
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>

              <Button
                color="error"
                onClick={() => {
                  selectedRows.ids.forEach((id) => {
                    dispatch(deleteContact(String(id)));
                  });

                  setConfirmOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
                    
        {/* <TableContainer component = {Paper} sx={{ mt: 1, maxWidth: 1200, margin: "0 auto", minHeight: 800 }}>
          <Table>

            <TableHead sx={{ justifyContent: "space-between" }}>
              <TableRow sx={{
                    height: 40, 
                    "& .MuiTableCell-root": {
                      textAlign: "center",
                    }
                  }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Created</TableCell>
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
                  >{contact.first_name} {contact.last_name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.status}</TableCell>
                  <TableCell>{contact.owner_name}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(
                      new Date(contact.created_at),
                      { addSuffix: true }
                  )}</TableCell>
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
        </TableContainer> */}
        {/* <Dialog sx={{position: "absolute"}} open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle sx={{fontWeight: 700}}>
          CONFIRMATION
        </DialogTitle>

        <DialogContent
          sx = {{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            width: 600,
          }}
          >
            Are you sure you want to delete this contact: <b>{selectedContact?.name}?</b>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="error"
              onClick={() => {
                if (selectedContact) {
                  handleDelete(selectedContact.id);
                }
                handleCloseDelete();
              }}
              >
                Yes
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{fontWeight: 700}}>
            {editingContact ? "Edit Contact" : "Add Contact"}
          </DialogTitle>

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              width: 600,
            }}
            >
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <TextField
                label="Company"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                fullWidth
              >
              </TextField>
              <TextField
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <TextField
                type="tel"
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
                <MenuItem value="Lead">Lead</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Opportunity">Opportunity</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
                <MenuItem value="Churned">Churned</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                disabled={form.name && form.email || form.phone ? false : true }
                onClick={handleSubmit}
                >
                  {editingContact ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog> */}
      </Box>
    );
}
