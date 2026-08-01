import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { DataGrid, type GridColDef, useGridApiRef, type GridRowSelectionModel } from '@mui/x-data-grid';
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
  DialogContentText,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  DialogActions,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
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

const AVATAR_PALETTE = [
  "#4f5fce",
  "#0f8f7a",
  "#c4577a",
  "#c17d2a",
  "#7965d1",
  "#2c8fb0",
  "#b1544a",
  "#4a935a",
];

function stringToAvatarColor(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = input.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: 10.5,
            fontWeight: 700,
            bgcolor: stringToAvatarColor(params.value ?? ""),
          }}
        >
          {getInitials(params.value ?? "")}
        </Avatar>
        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }} color="primary">
          {params.value}
        </Typography>
      </Box>
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
      <Chip
        label={value}
        size="small"
        sx={{
          height: 22,
          fontSize: '0.72rem',
          fontWeight: 700,
          borderRadius: 1.5,
          border : value === 'Contacted' ? '1px solid #888888c2': 'none',
          color: value === 'Contacted'  ? '#303030' : '#f7f6f6',
          backgroundColor: STATUS_COLORS[value as ContactStatus],
        }}
      />
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
        disableElevation
        sx={{
          py: '2px',
          px: 1.75,
          borderRadius: 999,
          textTransform: 'none',
          backgroundColor: 'primary.main',
          color: 'white',
          fontSize: '11px',
          fontWeight: 700,
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

const selectionCount =
  selectedRows.type === "exclude"
    ? contacts.length - selectedRows.ids.size
    : selectedRows.ids.size;

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
        <Paper
          variant="outlined"
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
            borderColor: 'divider',
            marginRight: 6,
            flexDirection: 'column',
            overflow: 'auto'
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.main',
                }}
              >
                <GroupsIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2, fontSize: 20 }}>
                  Contacts
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {contacts.length} total{hasSelection ? ` • ${selectionCount} selected` : ''}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Add contact">
                <IconButton
                  onClick={() => {
                    dispatch(clearError());
                    navigate(`/app/contacts/addcontact`)
                  }}
                  sx={{
                  fontSize: 12,
                  py: 1,
                  px: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  color: 'primary.main',
                  fontWeight: 700
                }}>
                  <PersonAddIcon titleAccess="Add Contact" fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={hasSelection ? "Delete selected" : "Select contacts to delete"}>
                <span>
                  <IconButton
                    onClick={() => setConfirmOpen(true)}
                    disabled={!hasSelection}
                    sx={{
                      border: '1px solid',
                      borderColor: hasSelection ? alpha('#e95858', 0.4) : 'divider',
                      borderRadius: 2,
                      py: 1,
                      px: 1,
                    }}
                  >
                    <DeleteIcon
                      sx={{
                        opacity: hasSelection ? 1 : 0.3,
                        color: hasSelection ? '#e95858' : 'text.disabled',
                      }}
                      fontSize="small"
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Box sx={{ px: 2, pb: 1 }}>
              <ErrorAlert
                message={error}
              />
            </Box>
          )}
          
          <DataGrid
            sx={{
              flex: 1,
              minHeight: 0,
              mx: 1,
              mb: 1,
              border: 'none',
              borderRadius: 3,
              fontSize: '0.85rem',
              cursor: 'pointer',
              overflow: 'auto',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.03),
                borderRadius: 2,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                opacity: 0.7,
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
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
        <Box sx={{display: {xs: 'none', lg: 'flex'}, flexDirection: 'column',  width: '15%', alignItems: 'end', minWidth: 270, }}>
          
          <Paper variant="outlined" sx={{ height: '50%', maxHeight: 300 , width: '100%', minHeight: 310, mx: 1,mb: 1, p: 1.5, borderRadius: 3, borderColor: 'divider'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, mb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: 14.5 }}>Recently Added</Typography>
            </Box>
            <List dense disablePadding sx={{ overflowY: 'auto', height: 'calc(100% - 36px)' }}>
              {recentContactsList.length === 0 ? (
                <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', mt: 3 }}>
                  No contacts yet
                </Typography>
              ) : recentContactsList.map((contact) => (
                <ListItem key={contact.id} onClick={() => navigate(`/app/contacts/${contact.id}`)} sx={{
                      cursor: 'pointer',
                      py: 0.75,
                      px: 0.75,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: (theme) =>
                        alpha(theme.palette.text.primary, 0.06),
                      },}}>
                  <ListItemAvatar sx={{ minWidth: 32 }}>
                    <Avatar sx={{ width: 26, height: 26, fontSize: 10.5, fontWeight: 700, bgcolor: stringToAvatarColor(contact.name) }}>
                      {getInitials(contact.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name.length > 22
                    ? `${(contact.name).slice(0, 22)}...`
                    : (contact.name)}
                    primaryTypographyProps={{color: "text.primary", fontSize: 13, fontWeight: 600 }}
                    sx={{textAlign: 'left'}}
                  />
                  <ListItemText
                    sx={{textAlign: 'right'}}
                    primaryTypographyProps={{ fontSize: 10.5, color: 'text.secondary' }}
                    primary={contact.created}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper variant="outlined" sx={{ height: '50%',maxHeight: 300, width: '100%', minWidth: 200, minHeight: 310, mx: 1, mt: 1, p: 1.5, borderRadius: 3, borderColor: 'divider'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, mb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <FlagCircleIcon sx={{ fontSize: 18, color: 'error.main' }} />
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: 14.5 }}>Priorities</Typography>
            </Box>
            <List dense disablePadding sx={{overflowY: 'auto', height: 'calc(100% - 36px)'}}>
              {PriorityList.length === 0 ? (
                <Typography sx={{ fontSize: 12.5, color: 'text.secondary', textAlign: 'center', mt: 3 }}>
                  Nothing flagged
                </Typography>
              ) : PriorityList.map((contact) => (
                <ListItem key={contact.id} onClick={() => navigate(`/app/contacts/${contact.id}`)} sx={{
                    cursor: 'pointer',
                    py: 0.75,
                    px: 0.75,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: (theme) =>
                      alpha(theme.palette.text.primary, 0.06),
                    },}}>
                  {contact.priorityIcon}
                  <ListItemText
                    primaryTypographyProps={{color: "text.primary", fontSize: 13, fontWeight: 600 }}
                    sx={{textAlign: 'left', justifyContent: 'center'}} >

                    {contact.name.length > 22
                    ? `${(contact.name).slice(0, 22)}...`
                    : (contact.name)}
                      
                  </ListItemText>
                  <ListItemText 
                    sx={{textAlign: 'right'}}
                    primaryTypographyProps={{ fontSize: 10.5, color: 'text.secondary' }}
                  >{contact.created}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, pb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  color: 'error.main',
                  flexShrink: 0,
                }}
              >
                <WarningAmberRoundedIcon />
              </Box>
              Delete contacts?
            </DialogTitle>

            <DialogContent>
              <DialogContentText sx={{ fontSize: '0.9rem' }}>
                Are you sure you want to delete{' '}
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedRows.ids.size === 0 || selectedRows.type === "exclude" ? 'all' : selectedRows.ids.size}
                </Box>{' '}
                selected contact(s)? This can't be undone.
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setConfirmOpen(false)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                Cancel
              </Button>

              <Button
                variant="contained"
                color="error"
                disableElevation
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
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