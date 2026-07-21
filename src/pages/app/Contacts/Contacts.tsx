import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { DataGrid, type GridColDef, useGridApiRef, type GridRowSelectionModel } from '@mui/x-data-grid';
// import { useSidebar } from "../../../hooks/useSidebar";
import { alpha } from '@mui/material/styles';
import { 
  clearError,
  deleteBulkContacts,
  fetchContactsLists,
} from "../../../store/contactsSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import {
  Box,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // TextField,
  // InputAdornment,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
//import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { Contact, ContactStatus } from "../../../types/contact";
import { useState } from "react";
import type { Priority } from "../../../types/global";
import ErrorAlert from "../../../components/Error";
import { formatName } from "../../../utils/formatText";
import { formatRelativeTime } from "../../../utils/formatTime";


const STATUS_COLORS: Record<ContactStatus, string> = {
  Contacted: '#ffffff',
  Opportunity: '#ffbb29',
  Customer: '#AD7450',  
  Lost: '#7a0000',
  Churned: '#000000',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

const getColumns = (
  navigate: ReturnType<typeof useNavigate>
): GridColDef[] => [
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
        px: 2, 
        py: '1px', 
        border : value === 'Contacted' ? '1px solid #6d6d6dc2': 'none',
        borderRadius: 3, 
        color: value === 'Churned' || value === 'Lost' ? 'white' : 'black',
        backgroundColor: STATUS_COLORS[value as ContactStatus]}}>
        {value}
    </Box>
    ),
  },
  { field: 'owner_name', 
    headerName: 'Owner', 
    flex: 1,
    align: 'left',
    
  },
  {
    field: 'created_at',
    headerName: 'Created',
    flex: 1,
    valueGetter: (value) =>
      value
        ? formatRelativeTime(new Date(value))
        : '',
  },
  { field: 'action', 
    headerName: 'Action', 
    width: 100, 
    flex: 1,
    align:'center',
    headerAlign:  'center',
    renderCell: ({ value }) => (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '4px'}}>
        <Button 
        onClick={() => navigate(`/app/contacts/${value}`)}
        sx={{
          py: '1px',
          backgroundColor: 'primary.main',
          color: 'white',
          fontSize: '11px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}>
        View
    </Button>
      </Box>
    )
  }
];

const paginationModel = { page: 0, pageSize: 10 };


export default function Contacts() {
  const { items: contacts, loading, loaded, error} = useSelector((state:RootState) => state.contacts);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const apiRef = useGridApiRef();
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const columns = getColumns(navigate);
  const fullname = (contact: Contact) => {
    return `${formatName(contact.first_name, contact.last_name)}`
  } 
  
  
  const rows = contacts.map(contact => ({
    id: contact.id,
    name: fullname(contact),
    email: contact.email,
    phone: contact.phone,
    status: contact.status,
    owner_name: formatName(contact.owner.first_name, contact.owner.last_name),
    created_at: contact.created_at,
    action: contact.id
  }));

    
  
useEffect(() => {

  if (loading ) return;

  const loadData = async () => {
    try {

      if (!loaded) {
        await dispatch(fetchContactsLists()).unwrap();
      }

    } catch {
      // Error handled by Redux state
    }
  };

  loadData();
}, [
  loading,
  loaded,
  dispatch,
]);


  
const recentContacts = [...contacts]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .slice(0, 10);

const recentContactsList = recentContacts.map(contact => ({
  name: `${fullname(contact)}`,
  id: contact.id,
  created: contact.created_at
        ? formatRelativeTime(new Date(contact.created_at))
        : '',
}));

const priorityOrder: Record<Priority, number> = {
  Highest: 3,
  High: 2,
  Low: 1,
};
const filteredContacts = contacts.filter(
  contact => contact.priority !== 'Low'
);
const sortedContacts = [...filteredContacts].sort((a, b) => {
  const priorityDiff =
    priorityOrder[b.priority] - priorityOrder[a.priority];

  if (priorityDiff !== 1) return priorityDiff;

  return (
    new Date(a.created_at).getTime() -
    new Date(b.created_at).getTime()
  );
});


const PriorityList = sortedContacts.map(contact => ({
  name: `${fullname(contact)}`,
  id: contact.id,
  priority: contact.priority,
  created: contact.created_at
    ? formatRelativeTime(new Date(contact.created_at))
        : '',
  priorityIcon:  
    contact.priority === 'High' ? (
      <PriorityIcon 
      sx={{
        fontSize: '16px', 
        color: PRIORITY_COLORS['High'],
        border: `1px solid ${PRIORITY_COLORS['High']}`,
        borderRadius: 20,
        marginRight: 1,
        padding: -1,
      }}/>
    ) : contact.priority === 'Highest' ? (
      <PriorityIcon sx={{
        fontSize: '16px',
        color: PRIORITY_COLORS['Highest'],
        border: `1px solid ${PRIORITY_COLORS['Highest']}`,
        borderRadius: 20,
        marginRight: 1,
        padding: -1,
      }} />
    ) : null,
}));

const hasSelection =
  selectedRows.type === "exclude" ||
  selectedRows.ids.size > 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, height: 850 }}>
        <CircularProgress />
      </Box>
    );
  }
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        flexDirection: 'rows',
        flex: 1,
        minWidth: 750,
        p: 2,
        mx: 2,
        height: 850}}>
          <Box sx={{display: {xs: 'none', lg: 'flex'}, flexDirection: 'column',  width: '15%', alignItems: 'end', minWidth: 285, }}>
            
            <Paper sx={{ height: '50%', maxHeight: 325 , width: '100%', minHeight: 310, m: 1, p: 1, borderRadius: 3,}}>
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
                      primary={contact.name.length > 25
                      ? `${(contact.name).slice(0, 25)}...`
                      : (contact.name)}
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
            <Paper sx={{ height: '50%',maxHeight: 325, width: '100%', minWidth: 200, minHeight: 310, m: 1, p: 1, borderRadius: 3}}>
              <Typography sx={{
                pb: 1,
                borderBottom: 0.2, 
                borderColor: '#92929238'
              }} variant="h6" fontWeight={700} margin={1} marginLeft={1}>Priorities</Typography>
              <List sx={{overflowY: 'auto', height: '75%'}}>
                {PriorityList.map((contact) => (
                  <ListItem key={contact.id} onClick={() => navigate(`/app/contacts/${contact.id}`)} sx={{
                      cursor: 'pointer',
                      height: 15,
                      py: 1.4,
                      borderRadius: 4,
                      '&:hover': {
                        bgcolor: (theme) =>
                        alpha(theme.palette.text.primary, 0.08),
                      },}}>
                    {contact.priorityIcon}
                    <ListItemText
                      primaryTypographyProps={{color: "primary", fontSize: 14 }}
                      sx={{textAlign: 'left', justifyContent: 'center'}} >

                      {contact.name.length > 25
                      ? `${(contact.name).slice(0, 25)}...`
                      : (contact.name)}
                        
                    </ListItemText>
                    <ListItemText 
                      sx={{textAlign: 'right'}}
                      primaryTypographyProps={{ fontSize: 11}}
                    >{contact.created}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
          <Paper
            sx={{
              justifyContent: 'center',
              p: 1,
              pt: 0,
              width: '50vw',
              minWidth: 300,
              transition: 'width 0.3s ease',
              maxHeight:  1000,
              display: 'flex',
              flex: 1,
              borderRadius: 3,
              marginLeft: 1,
              flexDirection: 'column',
              overflow: 'auto'
            }}
          >
            <Box sx={{display: 'flex', justifyContent: 'space-between', p: 2,}}>
              <Typography variant="h5" fontWeight={700} margin={1} >Contacts</Typography>
              <Box sx={{
                display: 'flex',
                width: '50%',
              }}>
                <Box sx={{width: '100%'}}>
                  {error  && (
                  <ErrorAlert
                    message={error}
                  />
                )}
                </Box>
                
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    dispatch(clearError());
                    navigate(`/app/addcontact`)
                  }}
                  sx={{
                  fontSize: 12,
                  py: 1,
                  px: 2,
                  border: '1px solid #bbbbbb88',
                  borderRadius: 2,
                  mr: 2,
                  fontWeight: 700
                }}>
                  <PersonAddIcon titleAccess="Add Contact"/>
                </IconButton>
                <Button
                  onClick={() => setConfirmOpen(true)}
                  disabled={!hasSelection}
                >
                  <DeleteIcon
                    sx={{
                      opacity: hasSelection ? 1 : 0,
                      color: '#e95858'
                    }}
                    fontSize="large"
                  />
                </Button>
              </Box>
            </Box>
            
            <DataGrid
              sx={{
                flex: 1,
                minHeight: 0,
                borderRadius: 3,
                fontSize: '0.85rem',
                cursor: 'pointer',
                overflow: 'auto'
              }}
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[30, 50]}
              rowHeight={30}
              checkboxSelection
              apiRef={apiRef}
              disableRowSelectionOnClick
              onRowSelectionModelChange={(ids) => {
                setSelectedRows(ids);
              }}
            />
            
          </Paper>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>

            <DialogContent>
              Are you sure you want to delete {selectedRows.ids.size === 0  || selectedRows.type === "exclude" ? 'all' : selectedRows.ids.size} selected contact(s)?
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>

              <Button
                color="error"
                onClick={async () => {
                  if (loading) return;
                  // setConfirmOpen(false);
                  try {
                    const ids = Array.from(selectedRows.ids).map(id => String(id));

                    await dispatch(deleteBulkContacts(ids)).unwrap();

                    setSelectedRows({
                      type: "include",
                      ids: new Set(),
                    });

                    setConfirmOpen(false);
                  } catch {
                    // Error in state
                  }
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
      </Box>
    );
}
