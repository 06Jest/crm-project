import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { DataGrid, type GridColDef, useGridApiRef, type GridRowSelectionModel } from '@mui/x-data-grid';
// import { useSidebar } from "../../../hooks/useSidebar";
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
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
//import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';
import { useState } from "react";
import ErrorAlert from "../../../components/Error";
import { formatName } from "../../../utils/formatText";
import { formatRelativeTime } from "../../../utils/formatTime";
import type { CustomerStatus } from "../../../types/customer";
import { fetchContactsLists } from "../../../store/contactsSlice";
import { deleteBulkCustomers, fetchCustomersLists } from "../../../store/customersSlice";
import { fetchDealsLists } from "../../../store/dealsSlice";


const STATUS_COLORS: Record<CustomerStatus, string> = {
  Active: '#84e77c',
  Inactive: '#e0e255',
  "At Risk": '#db9513',  
  Churned: '#ee5858',
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
    <Typography sx={{display: 'flex', alignItems: 'center', height: '100%', fontWeight: 600}} color="primary">
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
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        my: '-2px', 
        px: '10px',
        py: '3px',
        fontSize: '11px',
        fontWeight: 700,
        color: (theme) =>
          theme.palette.mode === "dark"
            ? "#fff"
            : "#252525e7",
        letterSpacing: '0.6px',
        borderRadius: 10, 
        width: 'fit-content',
        backgroundColor: `${STATUS_COLORS[value as CustomerStatus]}75`}}>
        <Box sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: STATUS_COLORS[value as CustomerStatus],
        }} />
        {value}
    </Box>
    ),
  },
  { field: 'open_deals', headerName: 'Open Deals', flex: 1 },
  { field: 'preferred_contact_time', headerName: 'Preferred time', flex: 1 },
  { field: 'owner_name', headerName: 'Owner',  flex: 1 },
  {
    field: 'created_at',
    headerName: 'Since',
    flex: 1,
    valueGetter: (value) =>
      value
        ? formatRelativeTime(new Date(value))
        : '',
  },
  { field: 'action', 
    headerName: 'Action', 
    width: 100, 
    align: 'center',
    headerAlign: 'center',
    flex: 1,
    renderCell: ({ value }) => (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '4px'}}>
        <Button 
        onClick={() => navigate(`/app/customers/${value}`)}
        disableElevation
        sx={{
          py: '2px',
          px: '12px',
          borderRadius: 6,
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

const paginationModel = { page: 0, pageSize: 30 };


export default function Customers() {
  const { items: contacts,  loaded: cLd } = useSelector((state:RootState) => state.contacts);
  const { items: deals,  loaded: dLd } = useSelector((state:RootState) => state.deals);
  const { items: customers, loading, loaded, error} = useSelector((state:RootState) => state.customers);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const apiRef = useGridApiRef();
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  const columns = getColumns(navigate);
  
  const rows = customers.map(customer => {
    const c = contacts.find(contact => 
      contact.id === customer.contact_id
    );

    if (!c) return null;
    
    let dealsOpen = 0;
      deals.forEach((deal) => {
        if(deal.contact_id === customer.contact_id) {
          if(deal.stage === 'Prospecting' || deal.stage === 'Negotiation' || deal.stage === 'Proposal' ) {
            dealsOpen++
          }
        } 
      })

    
    return {
      id: customer.id,
      name: `${formatName(c.first_name, c.last_name)} ${c.suffix || ''}`,
      email: c.email,
      phone: c.phone,
      status: customer.status,
      open_deals: dealsOpen,
      preferred_contact_time: c.preferred_contact_time,
      owner_name: customer.owner
        ? formatName(customer.owner.first_name, customer.owner.last_name)
        : "Unassigned",
      created_at: customer.created_at,
      action: customer.id
    }
  }).filter(Boolean);

    
  const needsLoading = !cLd || !dLd || !loaded;

useEffect(() => {

  if (!needsLoading) return;

  const loadData = async () => {
    try {
      const promises = [];

      if (!loaded) {
        promises.push(dispatch(fetchCustomersLists()).unwrap());
      }

      if (!cLd) {
        promises.push(dispatch(fetchContactsLists()).unwrap());
      }

      if (!dLd) {
        promises.push(dispatch(fetchDealsLists()).unwrap());
      }

      await Promise.all(promises);
    } catch {
      // Error handled by Redux state
    }
  };

  loadData();
}, [
  loading,
  loaded,
  cLd,
  dLd,
  needsLoading,
  dispatch,
]);


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
          <Paper
            variant="outlined"
            sx={(theme) => ({
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
              overflow: 'auto',
              border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
            })}
          >
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,}}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
                  <GroupsIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} letterSpacing={-0.3} lineHeight={1.2}>
                    Customers
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rows.length} {rows.length === 1 ? 'customer' : 'customers'} on file
                  </Typography>
                </Box>
              </Box>
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
                  onClick={() => setConfirmOpen(true)}
                  disabled={!hasSelection}
                  title="Delete selected"
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: hasSelection ? '#e9585866' : 'transparent',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: hasSelection ? '#e9585818' : 'transparent',
                    },
                  }}
                >
                  <DeleteIcon
                    sx={{
                      opacity: hasSelection ? 1 : 0,
                      color: '#e95858'
                    }}
                    fontSize="medium"
                  />
                </IconButton>
              </Box>
            </Box>
            
            <DataGrid
              sx={(theme) => ({
                flex: 1,
                minHeight: 0,
                border: 'none',
                borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
                borderRadius: '0 0 12px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                overflow: 'auto',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#242424' : '#f7f8fa',
                  fontWeight: 700,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f4f6f9',
                },
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },
              })}
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
          <Dialog
            PaperProps={{ sx: { borderRadius: 3 } }}
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
          >
            <DialogTitle sx={{ fontWeight: 700 }}>Confirm delete</DialogTitle>

            <DialogContent>
              Are you sure you want to delete {selectedRows.ids.size === 0  || selectedRows.type === "exclude" ? 'all' : selectedRows.ids.size} selected contact(s)?
            </DialogContent>

            <DialogActions sx={{ pb: 2, px: 3 }}>
              <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                Cancel
              </Button>

              <Button
                color="error"
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                onClick={async () => {
                  if (loading) return;
                  // setConfirmOpen(false);
                  try {
                    const ids = Array.from(selectedRows.ids).map(id => String(id));

                    await dispatch(deleteBulkCustomers(ids)).unwrap();

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

