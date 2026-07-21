import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { DataGrid, type GridColDef, useGridApiRef, type GridRowSelectionModel } from '@mui/x-data-grid';
// import { useSidebar } from "../../../hooks/useSidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";


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
} from "@mui/material";
//import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
// import SearchIcon from '@mui/icons-material/Search';
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
        px: '8px',
        py: '2px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#252525e7',
        letterSpacing: '1px',
        borderRadius: 3, 
        backgroundColor: STATUS_COLORS[value as CustomerStatus]}}>
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


export default function Customers() {
  const { isAuthenticated } = useAuth();
  const { items: contacts,  loaded: contactsLoaded } = useSelector((state:RootState) => state.contacts);
  const { items: deals,  loaded: dealsLoaded } = useSelector((state:RootState) => state.deals);
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
      owner_name: formatName(customer.owner.first_name, customer.owner.last_name),
      created_at: customer.created_at,
      action: customer.id
    }
  });

    
  
useEffect(() => {
  if (!isAuthenticated) return;
  // if (loading) return;

  const loadData = async () => {
    try {
      const promises = [];

      if (!loaded) {
        promises.push(dispatch(fetchCustomersLists()).unwrap());
      }

      if (!contactsLoaded) {
        promises.push(dispatch(fetchContactsLists()).unwrap());
      }

      if (!dealsLoaded) {
        promises.push(dispatch  (fetchDealsLists()).unwrap());
      }

      await Promise.all(promises);
    } catch {
      // Error handled by Redux state
    }
  };

  loadData();
}, [
  isAuthenticated,
  loading,
  loaded,
  contactsLoaded,
  dealsLoaded,
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
              <Typography variant="h5" fontWeight={700} margin={1} >Customers</Typography>
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
