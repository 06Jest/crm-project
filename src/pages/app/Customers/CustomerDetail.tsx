import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import 'leaflet/dist/leaflet.css';


import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,  
  Paper,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,  
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import PriorityIcon from '@mui/icons-material/PriorityHighRounded';

import type { RootState } from '../../../store/store';
import ErrorAlert from '../../../components/Error';
import { formatName, formatTitle } from '../../../utils/formatText';
import type { Priority } from '../../../types/global';
import { clearError, deleteCustomer, fetchCustomerListByID, fetchCustomersLists, updateCustomerNotes, updateCustomerStatus } from '../../../store/customersSlice';
import { CUSTOMER_STATUSES, type CustomerStatus } from '../../../types/customer';
import { formattedDate } from '../../../utils/formatTime';
import PaidIcon from '@mui/icons-material/Paid';
import { formatCurrency, totalArrayValues } from '../../../utils/formatCurrency';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { fetchContactListByID, fetchContactsLists } from '../../../store/contactsSlice';
import { fetchDealsLists, fetchDealsListsByContactID } from '../../../store/dealsSlice';
import { fetchOrgMembers } from '../../../store/organizationMemberSlice';


const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

const STATUS_COLORS: Record<CustomerStatus, string> = {
  Active: '#84e77c',
  Inactive: '#e0e255',
  "At Risk": '#db9513',  
  Churned: '#ee5858',
}

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    sortable: false,
    flex: 2,
  },
  {
    field: 'value',
    headerName: 'Value',
    flex: 0.8,
  },
  { field: 'owner', headerName: 'Owner', flex: 1, },
  { field: 'stage', headerName: 'Stage', flex: 1, },
  {
    field: 'created_at',
    headerName: 'Created',
    flex: 1,
  },
  
];

export default function CustomerDetail() {
  
  const { id } = useParams<{id: string }>();
  const { contact_id } = useParams<{contact_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [hoveredNotes, setHoveredNotes] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newNotes, setNewNotes] = useState("");
  const [hovered, setHovered] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | "">("");
  const [updateStatus, setUpdateStatus] = useState(false);

  useEffect(() => {
    if (!id || !contact_id) return;
    dispatch(fetchContactListByID(contact_id));
    dispatch(fetchCustomerListByID(id));
    dispatch(fetchDealsListsByContactID(contact_id))
  }, [id, dispatch, contact_id]);

  const { loaded: contactsLoaded, loading: contactsLoading } = useSelector((state: RootState) => state.contacts)
  const { loaded: dealsLoaded, } = useSelector((state: RootState) => state.deals)
  const { error, loaded: customersLoaded, loading:customersLoading } = useSelector((state: RootState) => state.customers)
  const {items: members, loaded: profilesLoaded} = useSelector((state: RootState) => state.orgmembers)
  const customer = useSelector((state: RootState) =>
    state.customers.items.find((c) => c.id === id)
  );

  
  
  const contact = useSelector((state: RootState) =>
    state.contacts.items.find((c) => c.id === customer?.contact_id)
  );

  const deals = useSelector((state: RootState) => state.deals.items);

  const allDeals = useMemo(() => {
    return deals.filter((d) => d.contact_id === contact?.id);
  }, [deals, contact?.id]);

  const totalWonValue = useSelector((state: RootState) =>
  state.deals.items.reduce((total, deal) => {
    if (deal.contact_id === contact?.id && deal.stage === "Closed Won") {
      return total + deal.value;
    }
    return total;
  }, 0)
  );
  
    useEffect(() => {
      
    if (!customersLoaded) dispatch(fetchCustomersLists()).unwrap();
    if (!contactsLoaded) dispatch(fetchContactsLists()).unwrap();
    if (!dealsLoaded) dispatch(fetchDealsLists()).unwrap();
    if (!profilesLoaded) dispatch(fetchOrgMembers()).unwrap();
  }, [
    customersLoaded,
    contactsLoaded,
    dealsLoaded,
    profilesLoaded,
    dispatch,
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [successMessage, setSuccessMessage] = useState('');


  if (
    (!customer || !contact) &&
    (customersLoading || contactsLoading)
  ) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 800
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!customer || !contact) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, height: 800 }}>
        <Typography variant="h6" color="text.secondary">
          Customer not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            dispatch(clearError());
            navigate(-1)
          }}
          sx={{ mt: 2, textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
        >
          Go back
        </Button>
      </Box>
    );
  }

  
  const handleDeleteConfirm = async () => {
    if (!customer) return;

    try {
      await dispatch(deleteCustomer(customer?.id)).unwrap();
      navigate('/app/customers');
    } catch {
      //Error in State
    }
  };


  const priorityIcon = (priority: Priority) => {
    if (priority === 'High') {
      return <PriorityIcon sx={{
        color: PRIORITY_COLORS['High'],
        border: `1px solid ${PRIORITY_COLORS['High']}`,
        borderRadius: 20,
      }} fontSize='large' />
    }
    if (priority === 'Highest') {
      return <PriorityIcon sx={{
        color: PRIORITY_COLORS['Highest'],
        border: `1px solid ${PRIORITY_COLORS['Highest']}`,
        borderRadius: 20,
      }} fontSize='large' />
    }
  }

  const handleEditStatus = () => {
    setSelectedStatus(customer?.status ?? "");
  };


  const handleUpdateStatus = async () => {
    if (!customer || !selectedStatus) return;

    try {
      await dispatch(
        updateCustomerStatus({
          id: customer.id,
          status: selectedStatus,
        })
      ).unwrap();

      setUpdateStatus(false);
      setIsUpdatingStatus(false);
    } catch {
      //Error in state
    }
  };


  const handleEditNotes = () => {
    setNewNotes(customer?.notes ?? "");
    setIsEditingNotes(true);
  };

  const handleNewNotes = async () => {
    if (!customer || !newNotes) return;

    try {
      await dispatch(
        updateCustomerNotes({
          id: customer.id,
          notes: newNotes,
        })
      ).unwrap();
      
      setIsEditingNotes(false);
    } catch {
      //Error in state
    }
  }
  const rows = allDeals.map(d => ({
    id: d.id,
    title: d.title.length > 25
        ? `${d.title.slice(0, 25)}...`
        : formatTitle(d.title),
    value: formatCurrency(d.value),
    stage: d.stage,
    owner: formatName(d.owner.profile.first_name, d.owner.profile.last_name),
    created_at: formattedDate(d.created_at),
  }));

  const paginationModel = { page: 0, pageSize: 5 };
  const openDeals = allDeals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const wonDeals = allDeals.filter((d) => d.stage === 'Closed Won');
  const lostDeals = allDeals.filter((d) => d.stage === 'Closed Lost');
  const biggestWonDeal = wonDeals.reduce((max, deal) => {
    if (!max || deal.value > max.value) {
      return deal;
    }

    return max;
  }, wonDeals[0]);  

  
  const recentLost = [...lostDeals]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .slice(0, (allDeals.length));
  const wonPercent = allDeals.length
    ? Math.round((wonDeals.length / allDeals.length) * 100)
    : 0;

  const lostPercent = allDeals.length
    ? Math.round((lostDeals.length / allDeals.length) * 100)
    : 0;

  const wonBy = members.find((p) => p.id === biggestWonDeal.closed_by)
  const lostBy = recentLost[0]
  ? members.find((p) => p.profile.id === recentLost[0].closed_by)
  : undefined;


  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', pb: 3 }}>

      {error && (
        <Box sx={{ width: '100%', my: 2 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
      )}

      <Box sx={{display: 'flex', justifyContent: 'left'}}>
        <Button 
          startIcon={<ArrowBackIcon/>}
          onClick={() => {
            navigate(-1);
          } }
          sx={{ alignSelf: 'start', textTransform: 'none', fontWeight: 600, color: 'primary.main'}}>
          Back
        </Button>
      </Box>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          pt: '10px !important',
          p: 4,
          borderRadius: 3,
          mt: 2,
          border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
        })}
      >
        <Box sx={{display: 'flex', justifyContent: 'center',mb: 2}}>
          <Typography sx={{border: '1px solid #ccc', height: '100%', borderRadius: 10,px: 2, py: 0.5, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',}}>Customer</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, width: '100%' }}>
          <Box sx={{display: 'flex', width: 100, mr: 2, flexDirection: 'column', justifyContent: 'space-between', height: 185 }}>
            <Box sx={(theme) => ({
              width: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height:100,
              border: '1px solid #ccccccd8',
              bgcolor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#f4f5f7',
              borderRadius: 100,
            })}>
              <PersonIcon sx={{fontSize: '80px', color: '#686868b0'}}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifySelf: 'end'}}>
              <Button 
                title='View Full Contact Details'
                onClick={()=> navigate(`/app/contacts/${contact.id}`)}
                 sx={{border: '1px solid', borderColor: 'primary.main', fontWeight: 700, p: '3px 8px', mt: 1, fontSize: '10px', borderRadius: 2, textTransform: 'none'}}>
                Full Details
              </Button>
              <Button 
                title='Add new Deal for this customer'
                onClick={()=> navigate(`/app/adddeal/${contact.id}`)}
                 sx={{border: '1px solid', borderColor: 'primary.main', fontWeight: 700, p: '3px 8px', mt: '6px', fontSize: '10px', borderRadius: 2, textTransform: 'none'}}>
                Add Deal
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflowWrap: "anywhere", wordBreak: "break-word",}}>
            <Typography variant='h4' fontWeight={700} sx={{display: 'flex', alignItems: 'center'}}>
              {formatName(contact.first_name, contact.last_name)} {contact.suffix || ''} 
              <Box  title={`${contact.priority} Priority`} component="span" sx={{ ml: 1, cursor: 'pointer', display: "flex", width: 30, height: 30 }}>
                {priorityIcon(contact.priority)}
              </Box>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 1, justifyContent: 'space-between',width: '100%' }}>
              <Box  sx={{display: 'flex', width: '60%', alignItems: 'center' }}>
                <EmailIcon color="action" sx={{fontSize: '15px'}}/>
                <Box title="Email" sx={{ ml: 1,  cursor: 'pointer' }}>
                  <Typography sx={{fontSize: '13px'}}>{contact.email || 'Not Provided'}</Typography>
                </Box>
              </Box>
              <Box sx={{display: 'flex', width: '40%', alignItems: 'center', justifyContent: 'end' }}>
                <CalendarTodayIcon color="action" sx={{fontSize: '15px'}}/>
                <Box title={`Customer since: ${formattedDate(customer?.created_at)}`} sx={{ ml: 1, cursor: 'pointer' }}>
                  <Typography sx={{fontSize: '13px'}}>{formattedDate(customer?.created_at)}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <PhoneIcon color="action"  sx={{fontSize: '15px'}}/>
                <Box title="Phone number"  sx={{ ml: 1, cursor: 'pointer' }}>
                  <Typography sx={{fontSize: '13px'}}>{contact.phone || 'Not Provided'}</Typography>
                </Box>
              </Box>
              <Box sx={{display: 'flex', width: '40%', alignItems: 'center', justifyContent: 'end' }}>
                <PaidIcon color="action" sx={{fontSize: '15px'}}/>
                <Box title={`Total revenue from ${formatName(contact.first_name, contact.last_name)} ${contact.suffix || ''} `} sx={{ ml: 1, cursor: 'pointer' }}>
                  <Typography sx={{fontSize: '14px', fontWeight: 700, letterSpacing: '1px', color: 'primary.main'}}>{formatCurrency(totalWonValue)}</Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{my: '10px'}}/>
            {!isEditingNotes ? (
            <Box
              onMouseEnter={() => setHoveredNotes(true)}
              onMouseLeave={() => setHoveredNotes(false)}
              sx={(theme) => ({
                display: 'flex',
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#242424' : '#f7f8fa',
                p: '8px 10px',
              })}>
              <Typography title="Notes" fontWeight={500} fontSize={12} color="text.secondary" sx={{cursor: 'pointer', minHeight: 40, width: '95%' }}>
                {customer?.notes}
              </Typography>
              <Box width={'5%'} >
                <IconButton onClick={() => {
                  setIsEditingNotes(true)
                  handleEditNotes()
                }}
                title='Edit Notes' sx={{opacity: hoveredNotes ? 1 : 0, p: '2px',  transition: "all 0.3s ease", transform: hoveredNotes ? "translateX(0)" : "translateX(8px)",}}>
                  <EditNoteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            ) : (
              <Box sx={{display: 'flex'}}>
                <TextField
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  size="small"
                  multiline
                  fullWidth
                  rows={3}
                  sx={{ 
                    '& .MuiInputBase-input': {
                        fontSize: '12px',
                      },
                      "& .MuiInputBase-inputMultiline": {
                        lineHeight: 1.1,
                      },
                      "& .MuiOutlinedInput-root": {
                        padding: "5px 10px",
                        borderRadius: 2,
                      },
                   }}
                />
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                   <IconButton title='Confirm Update' onClick={handleNewNotes} sx={{p:'2px'}}>
                      <CheckIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                    <IconButton title='Cancel' onClick={() => setIsEditingNotes(false)} sx={{p:'2px'}}>
                      <CancelIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                </Box>
              </Box>
              )}
            <Box sx={{display: 'flex', mt: 1}}>
              <Chip
                label={contact.preferred_contact_time}
                title="Preferred contact time"
                variant="filled"
                size='small'
                sx={{
                  px: '4px',
                  py: '1px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  cursor: 'pointer',
                  mr: 1,
                  border: '1px solid #7a7a7a98',
                  backgroundColor: '#cccccc00',
                }}
              />
              <Chip
                label={formatName(contact.owner.profile.first_name, contact.owner.profile.last_name)}
                title="Contact owner"
                size='small'
                sx={{
                  px: '4px',
                  py: '1px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  cursor: 'pointer',
                  mr: 1,
                  border: `1px solid`,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: '#cccccc00',
                }}
              />
              {!isUpdatingStatus ? (
                <Box
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Chip
                    label={customer?.status}
                    title="Status"
                    size='small'
                    sx={{
                      px: '4px',
                      py: '1px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#252525e7',
                      letterSpacing: '0.6px',
                      cursor: 'pointer',
                      borderRadius: 10, 
                      backgroundColor: `${STATUS_COLORS[customer?.status as CustomerStatus]}55`,
                    }}
                  />
                  <IconButton onClick={() => {
                    setIsUpdatingStatus(true)
                  }} title='Update Status' sx={{p:'1px'}}>
                    <ModeEditIcon sx={{ fontSize: '13px', opacity: hovered ? 1 : 0,  transition: "all 0.3s ease", transform: hovered ? "translateX(0)" : "translateX(8px)",}}/>
                  </IconButton>
                </Box>
                ): (
                  <Box sx={{display: 'flex', justifyContent: 'center',alignItems: 'center', mb: '-8px'}}>
                    <TextField
                      select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value as CustomerStatus)
                      }
                      size="small"
                      sx={{ 
                        '& .MuiInputBase-input': {
                            py: '2px',
                            fontSize: '12px'
                          },
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      }} 
                      slotProps={{
                        select: {
                          MenuProps: {
                            PaperProps: { sx: { maxHeight: 200 } },
                          },
                        },
                      }}
                    >
                      {CUSTOMER_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton title='Confirm Update' onClick={() => setUpdateStatus(true)} sx={{p:'2px'}}>
                      <CheckIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                    <IconButton title='Cancel' onClick={() => setIsUpdatingStatus(false)} sx={{p:'2px'}}>
                      <CancelIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                  </Box>
                )}
            </Box>
          </Box>
            
          <Box sx={{ display: 'flex', width: 30,ml: 1, flexDirection: 'column', position: 'relative' }}>
            <Button
              variant='outlined'
              color='error'
              title="Delete Customer"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{fontSize: '10px', fontWeight: 700, mt: '-20px', ml: '-50px', position: 'absolute', textTransform: 'none', borderRadius: 2 }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Paper>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          p: 2,
          borderRadius: 3,
          my: 2,
          border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
        })}
      >
        <Typography ml={2} variant='subtitle1' fontWeight={700} letterSpacing={0.4} sx={{justifySelf: 'flex-start'}}>
              Deals
        </Typography>
        <Box sx={{ height: 320, mt: 2,   width: '100%', mb: 1}}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            rowHeight={32}
            sx={(theme) => ({
              pb: 0,
              fontSize: '13px',
              borderRadius: 2,
              border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.mode === 'dark' ? '#242424' : '#f7f8fa',
                fontWeight: 700,
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f4f6f9',
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
            })}
          />
        </Box>
      </Paper>
        <Box  sx={{display: 'flex', flexDirection: 'column', width: '100%', alignItems:'center'}}>
          
          <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', }}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' ,height: 125}}>
              <Paper variant="outlined" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '33%', borderTop: '3px solid #3b82f6', borderLeft: '1px solid #c7c7c78a', borderRight: '1px solid #c7c7c78a', borderBottom: '1px solid #c7c7c78a', p: '8px 14px', borderRadius: 3, }}>
                <Box  sx={{height: '20%', fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: 0.4}}>
                   TOTAL DEALS
                </Box>
                <Box sx={{height: '60%'}}>
                  <Typography variant='h3' sx={{fontWeight: 700}}>{allDeals.length}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between' , height:'20%', fontSize: '11px', color: 'text.secondary'}}>
                  <Box>won: {wonPercent}%</Box>
                  <Box>lost: {lostPercent}%</Box>
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '33%', borderTop: '3px solid #e08a1f', borderLeft: '1px solid #c7c7c78a', borderRight: '1px solid #c7c7c78a', borderBottom: '1px solid #c7c7c78a', p: '8px 14px', borderRadius: 3}}>
                <Box sx={{height: '20%', fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: 0.4}}>
                  OPEN DEALS
                </Box>
                <Box sx={{height: '60%'}}>
                  <Typography variant='h3' sx={{fontWeight: 700}}>{openDeals.length}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between' , height:'20%', fontSize: '11px'}}>
                  <Typography sx={{fontSize: '11px', color: 'text.secondary'}}>Total value:</Typography>
                  <Typography sx={{fontSize: '11px', fontWeight: 600}}>{totalArrayValues(openDeals.map((deal) => deal.value))}</Typography>
                </Box>
              </Paper>
              <Paper variant="outlined" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '33%', borderTop: '3px solid #1f9d55', borderLeft: '1px solid #c7c7c78a', borderRight: '1px solid #c7c7c78a', borderBottom: '1px solid #c7c7c78a', p: '8px 14px', borderRadius: 3}}>
                <Box sx={{height: '20%', fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: 0.4}}>
                  DEALS WON
                </Box>
                <Box sx={{height: '60%'}}>
                  <Typography variant='h3' sx={{fontWeight: 700}}>{wonDeals.length}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between' , height:'20%', }}>
                  <Typography sx={{fontSize: '11px', color: 'text.secondary'}}>revenue:</Typography>
                  <Typography sx={{fontSize: '11px', fontWeight: 600}}>{totalArrayValues(wonDeals.map((deal) => deal.value))}</Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
          <Box sx={{display: 'flex', my: 2, justifyContent: 'center', gap: 2, width: '100%'}}>
            <Paper variant="outlined" sx={{display: 'flex', flexDirection: 'column', width:'50%', border: '1px solid #c7c7c78a', borderLeft: '3px solid #1f9d55', p: '10px 14px', borderRadius: 3}}>
              <Box sx={{height: 15, fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: 0.4}}>
                BIGGEST DEAL WON
              </Box>
              <Box sx={{flex: 1, my: 2}}>
                <Typography sx={{ fontWeight: 700}} variant='h4'>{biggestWonDeal 
                  ? formatCurrency(biggestWonDeal.value)
                  : "No won deals"
                }</Typography>
                <Typography variant="body2" color="text.secondary">
                  {biggestWonDeal?.title ?? "No won deals"}
                </Typography>
              </Box>
              <Box sx={{height: 15, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'text.secondary'}}>
                <Box>
                  {biggestWonDeal?.close_date
                    ? formattedDate(biggestWonDeal.close_date)
                    : '???'}
                </Box>
                <Box sx={{cursor: 'pointer'}} title={`Won by: ${formatName(wonBy?.profile.first_name, wonBy?.profile.last_name)}`}>{formatName(wonBy?.profile.first_name, wonBy?.profile.last_name) ?? '???'}</Box>
              </Box>
            </Paper>
            <Paper variant="outlined" sx={{display: 'flex', flexDirection: 'column', width:'50%', border: '1px solid #c7c7c78a', borderLeft: '3px solid #d9424b', p: '10px 14px', borderRadius: 3}}>
              <Box sx={{height: 15, fontSize: '11px', fontWeight: 600, color: 'text.secondary', letterSpacing: 0.4}}>
                RECENT LOST DEAL
              </Box>
              <Box sx={{flex: 1, my: 2}}> 
                <Typography sx={{ fontWeight: 700}} variant='h4'>{recentLost[0]
                  ? formatCurrency(recentLost[0].value)
                  : "0"
                }</Typography>
                <Typography variant="body2" color="text.secondary">{recentLost[0]?.title ?? "No lost deals yet"}</Typography>
              </Box>
              <Box sx={{height: 15, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'text.secondary'}}>
                <Box>{recentLost[0]?.title ?? ""}</Box>
                <Box sx={{cursor: 'pointer'}} title={`Lost by: ${formatName(lostBy?.profile.first_name, lostBy?.profile.last_name)}`}>{formatName(lostBy?.profile.first_name, lostBy?.profile.last_name)}</Box>
              </Box>
            </Paper>
          </Box>
            
        </Box>
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete contact?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this customer <strong>{contact.first_name} {contact.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disableElevation
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        open={updateStatus}
        onClose={() => setUpdateStatus(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update status for <strong>{contact.first_name} {contact.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setUpdateStatus(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            color="warning"
            variant="contained"
            disableElevation
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            onClick={() => {
              handleUpdateStatus();
              setUpdateStatus(false);
              handleEditStatus()
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
