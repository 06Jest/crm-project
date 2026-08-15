
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
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import { useState } from "react";
import ErrorAlert from "../../../components/Error";
import { formatName } from "../../../utils/formatText";
import { formatRelativeTime } from "../../../utils/formatTime";
import type { CustomerStatus } from "../../../types/customer";
import { fetchContactsLists } from "../../../store/contactsSlice";
import { deleteBulkCustomers, fetchCustomersLists } from "../../../store/customersSlice";
import { fetchDealsLists } from "../../../store/dealsSlice";
import CustomersSkeleton from "../../../components/CustomersSkeleton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";

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
    width: 120,
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
  { field: 'open_deals', headerName: 'Open Deals', width: 100 },
  { field: 'preferred_contact_time', headerName: 'Preferred time', flex: 1 },
  { field: 'owner_name', headerName: 'Owner',  flex: 1 },
  {
    field: 'created_at',
    headerName: 'Since',
    width: 100,
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
        ? formatName(customer.owner.profile.first_name, customer.owner.profile.last_name)
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

const refreshCustomers = async () => {
  if (loading) return;

  try {
    await Promise.all([
      dispatch(fetchCustomersLists()).unwrap(),
      dispatch(fetchContactsLists()).unwrap(),
      dispatch(fetchDealsLists()).unwrap(),
    ]);
  } catch {
    // Error handled by Redux state
  }
};

const hasSelection =
  selectedRows.type === "exclude" ||
  selectedRows.ids.size > 0;

  if (needsLoading) {
    return <CustomersSkeleton />;
  }
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      minWidth: 0,
      minHeight: 0,
      mx: 2,
      overflow: 'auto',
    }}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: {xs: 1, sm: 1.25, md: 1.5}, width: '100%', px: {xs: 0.5, sm: 0.5, md: 2} }}>
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
            <Typography sx={{ lineHeight: 1.2, fontSize: {md: 20, sm: 18, xs: 16}}} fontWeight={800} letterSpacing={-0.3}>
              Customers
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {rows.length}
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
        <Box sx={{display: 'flex'}}>
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
          <Tooltip title="Refresh Customers" >
            <span
              style={{
                display: 'flex',
                alignSelf: 'center',
              }}
            >
              <IconButton
                onClick={refreshCustomers}
                disabled={loading}
                sx={{
                  alignSelf: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  py: { sm: 0.75, md: 1 },
                  px: { sm: 0.75, md: 1 },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={16}
                    sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}
                  />
                ) : (
                  <RefreshIcon
                    sx={{ fontSize: { xs: 15, sm: 17, md: 20 } }}
                  />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <Paper
        variant="outlined"
        sx={(theme) => ({
          px: {md: 2, sm: 0.5},
          pt: 0,
          minWidth: 300,
          width: '100%',
          transition: 'width 0.3s ease',
          display: 'flex',
          flex: 1,
          borderRadius: 3,
          overflowX: 'auto',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
        })}
      >
        <DataGrid
          sx={(theme) => ({
            flex: 1,
            minHeight:  800,
            minWidth: 1000,
            border: 'none',
            borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
            borderRadius: '0 0 12px 12px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            overflowY: 'auto',
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
