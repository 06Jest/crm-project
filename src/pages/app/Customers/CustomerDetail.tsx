import { useState } from 'react'
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
import { clearError, deleteCustomer, updateCustomerNotes, updateCustomerStatus } from '../../../store/customersSlice';
import { CUSTOMER_STATUSES, type CustomerStatus } from '../../../types/customer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formattedDate } from '../../../utils/formatTime';
import PaidIcon from '@mui/icons-material/Paid';
import { formatCurrency, totalArrayValues } from '../../../utils/formatCurrency';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [hoveredNotes, setHoveredNotes] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newNotes, setNewNotes] = useState("");
  const [hovered, setHovered] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | "">("");
  const [updateStatus, setUpdateStatus] = useState(false);
  const { error } = useSelector((state: RootState) => state.customers)
  const {items: profiles} = useSelector((state: RootState) => state.profile)
  const customer = useSelector((state: RootState) =>
    state.customers.items.find((c) => c.id === id)
  );
  
  const contact = useSelector((state: RootState) =>
    state.contacts.items.find((c) => c.id === customer?.contact_id)
  );

  const allDeals = useSelector((state: RootState) => 
    state.deals.items.filter((d) => d.contact_id === contact?.id));

  const totalWonValue = useSelector((state: RootState) =>
  state.deals.items.reduce((total, deal) => {
    if (deal.contact_id === contact?.id && deal.stage === "Closed Won") {
      return total + deal.value;
    }
    return total;
  }, 0)
  );
  

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [successMessage, setSuccessMessage] = useState('');




  if (!contact) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Customer not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            dispatch(clearError());
            navigate('/app/customers')
          }}
          sx={{ mt: 2 }}
        >
          Back to customers
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
    owner: formatName(d.owner.first_name, d.owner.last_name),
    created_at: formattedDate(d.created_at),
  }));

  const paginationModel = { page: 0, pageSize: 5 };
  const openDeals = allDeals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const wonDeals = allDeals.filter((d) => d.stage === 'Closed Won');
  const lostDeals = allDeals.filter((d) => d.stage === 'Closed Lost');
  const biggestWonDeal = wonDeals.reduce((max, deal) => {
  return deal.value > max.value ? deal : max;
}, allDeals[0]);

  const wonBy = profiles.find((p) => p.id === biggestWonDeal.closed_by)
  const lostBy = profiles.find((p) => p.id === recentLost[0].closed_by  )
  const recentLost = [...lostDeals]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .slice(0, (allDeals.length));
  const wonPercent = allDeals
  ? Math.round((wonDeals.length / allDeals.length) * 100)
  : 0;

  const lostPercent= allDeals
    ? Math.round((lostDeals.length / allDeals.length) * 100)
    : 0;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>

      {error && (
        <Box sx={{ width: '100%', my: 2 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
      )}

      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Button 
          startIcon={<ArrowBackIcon/>}
          onClick={() => {
            navigate(`/app/customers`);
            dispatch(clearError());
          } }
          sx={{ alignSelf: 'start'}}>
          Customers
        </Button>
        <Button 
          endIcon={<ArrowForwardIcon/>}
          onClick={() => {
            navigate('/app/deals');
            dispatch(clearError());
          } }
          sx={{ alignSelf: 'start'}}>
          Deals
        </Button>
      </Box>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, width: '100%' }}>
          <Box sx={{display: 'flex', width: 100, mr: 2, flexDirection: 'column', justifyContent: 'space-between', height: 185 }}>
            <Box sx={{width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', height:100, border: '1px solid #ccccccd8', borderRadius: 100}}>
              <PersonIcon sx={{fontSize: '80px', color: '#686868b0'}}/>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifySelf: 'end'}}>
              <Button 
                title='View Full Contact Details'
                onClick={()=> navigate(`/app/contacts/${contact.id}`)}
                 sx={{border: '1px solid', borderColor: 'primary.main', fontWeight: 700, p: '2px 8px', mt: 1, fontSize: '10px'}}>
                Full Details
              </Button>
              <Button 
                title='Add new Deal for this customer'
                onClick={()=> navigate(`/app/adddeal/${contact.id}`)}
                 sx={{border: '1px solid', borderColor: 'primary.main', fontWeight: 700, p: '2px 8px', mt: '2px', fontSize: '10px'}}>
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
                  <Typography sx={{fontSize: '14px', fontWeight: 700}}>{formatCurrency(totalWonValue)}</Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{my: '2px'}}/>
            {!isEditingNotes ? (
            <Box
              onMouseEnter={() => setHoveredNotes(true)}
              onMouseLeave={() => setHoveredNotes(false)}
              sx={{display: 'flex'}}>
              <Typography title="Notes" fontWeight={500} fontSize={12} sx={{cursor: 'pointer', minHeight: 52, width: '95%', ml: '10px' }}>
                {customer?.notes}
              </Typography>
              <Box width={'5%'}>
                <IconButton onClick={() => {
                  setIsEditingNotes(true)
                  handleEditNotes()
                }}
                title='Edit Notes' sx={{opacity: hoveredNotes ? 1 : 0, p: 0}}>
                  <EditNoteIcon/>
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
            <Box sx={{display: 'flex'}}>
              <Chip
                label={contact.preferred_contact_time}
                title="Preferred contact time"
                variant="filled"
                size='small'
                sx={{
                  px: '2px',
                  py: '1px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  mt: 1,
                  mr: 2,
                  border: '1px solid #7a7a7a98',
                  backgroundColor: '#cccccc00',
                }}
              />
              <Chip
                label={formatName(contact.owner.first_name, contact.owner.last_name)}
                title="Contact owner"
                size='small'
                sx={{
                  px: '2px',
                  py: '1px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  mt: 1,
                  mr: 2,
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
                      px: '2px',
                      py: '1px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#252525e7',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      mt: 1,
                      borderRadius: 3, 
                      backgroundColor: STATUS_COLORS[customer?.status as CustomerStatus],
                    }}
                  />
                  <IconButton onClick={() => setUpdateStatus(true)} title='Update Status' sx={{p:'2px',mt: 1,}}>
                    <ModeEditIcon sx={{opacity: hovered ? 1 : 0, fontSize: '13px'}}/>
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
                    <IconButton title='Confirm Update' onClick={handleUpdateStatus} sx={{p:'2px'}}>
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
              sx={{fontSize: '10px', fontWeight: 700, mt: '-20px', ml: '-50px', position: 'absolute' }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 3, mt: 2 }}>
        <Typography variant='h6' fontWeight={700} sx={{justifySelf: 'flex-start'}}>
              Deals
          </Typography>
        <Box  sx={{display: 'flex', flexDirection: 'column', width: '100%', alignItems:'center'}}>
          
          <Box sx={{display: 'flex', flexDirection: 'column', width: '80%'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 3, width: '100%'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '33%', border: '1px solid #c7c7c78a', p: '4px 12px', borderRadius: 3, }}>
                <Box sx={{height: '10%', fontSize: '11px'}}>
                  Total Deals
                </Box>
                <Box sx={{height: '60%', textAlign: 'center'}}>
                  <Typography variant='h2' sx={{fontWeight: 700, fontFamily: 'cursive',}}>{allDeals.length}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between' , height:'20%', fontSize: '11px'}}>
                  <Box>won: {wonPercent}%</Box>
                  <Box>lost: {lostPercent}%</Box>
                </Box>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '33%', border: '1px solid #c7c7c78a', p: '4px 12px', borderRadius: 3}}>
                <Box sx={{height: '10%', fontSize: '11px'}}>
                  Open Deals
                </Box>
                <Box sx={{height: '60%', textAlign: 'center'}}>
                  <Typography variant='h2' sx={{fontWeight: 700, fontFamily: 'cursive',}}>{openDeals.length}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between' , height:'20%', fontSize: '11px'}}>
                  <Typography sx={{fontSize: '11px'}}>Total value:</Typography>
                  <Typography sx={{fontSize: '11px'}}>{totalArrayValues(openDeals.map((deal) => deal.value))}</Typography>
                </Box>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '33%'  , border: '1px solid #c7c7c78a', p: '4px 12px', borderRadius: 3}}>
                <Box sx={{height: '10%', fontSize: '11px'}}>
                  Deals Won
                </Box>
                <Box sx={{height: '60%', textAlign: 'center'}}>
                  <Typography variant='h2' sx={{fontWeight: 700, fontFamily: 'cursive',}}>{wonDeals.length}</Typography>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between' , height:'20%', }}>
                  <Typography sx={{fontSize: '11px'}}>revenue:</Typography>
                  <Typography sx={{fontSize: '11px'}}>{totalArrayValues(wonDeals.map((deal) => deal.value))}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{display: 'flex', mt: 2, justifyContent: 'center', gap: 3, width: '100%'}}>
              <Box sx={{display: 'flex', flexDirection: 'column', width:'50%', border: '1px solid #c7c7c78a', p: '4px 12px', borderRadius: 3}}>
                <Box sx={{height: 15, fontSize: '11px'}}>
                  Biggest Deal Won
                </Box>
                <Box sx={{flex: 1, my: 2}}>
                  <Typography sx={{fontFamily: 'cursive', fontWeight: 700}} variant='h4' ml={4}>{formatCurrency(biggestWonDeal.value)}</Typography>
                  <Box mx={4} >{biggestWonDeal.title}</Box>
                </Box>
                <Box sx={{height: 15, display: 'flex', justifyContent: 'space-between', fontSize: '11px'}}>
                  <Box>{formattedDate(biggestWonDeal.close_date)}</Box>
                  <Box>Won by:{wonBy?.display_name}</Box>
                </Box>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', width:'50%', border: '1px solid #c7c7c78a', p: '4px 12px', borderRadius: 3}}>
                <Box sx={{height: 15, fontSize: '11px'}}>
                  Recent Lost Deal
                </Box>
                <Box sx={{flex: 1, my: 2}}>
                  <Typography sx={{fontFamily: 'cursive', fontWeight: 700}} variant='h4' ml={4}>{formatCurrency(recentLost[0].value)}</Typography>
                  <Box mx={4} >{recentLost[0].title}</Box>
                </Box>
                <Box sx={{height: 15, display: 'flex', justifyContent: 'space-between', fontSize: '11px'}}>
                  <Box>{formattedDate(recentLost[0].close_date)}</Box>
                  <Box>Lost by:{lostBy?.display_name}</Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ height: 320, mt: 3,   width: '100%', mb: 3}}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                rowHeight={32}
                sx={{ border: '1px solid #c7c7c78a', p: 2, pb: 0, fontSize: '13px', borderRadius: 4, }}
              />
            </Box>
          </Box>
          
        </Box>
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete contact?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this customer <strong>{contact.first_name} {contact.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={updateStatus}
        onClose={() => setUpdateStatus(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update status for <strong>{contact.first_name} {contact.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateStatus(false)}>
            Cancel
          </Button>
          <Button
            color="warning"
            variant="contained"
            onClick={() => {
              setUpdateStatus(false);
              setIsUpdatingStatus(true);
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

