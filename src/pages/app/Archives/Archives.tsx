import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import ErrorAlert from "../../../components/Error";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchArchives,
  setArchiveType,
  setArchiveEntity,
  setArchiveSearch,
  restoreRecord,
} from "../../../store/archiveSlice";

import type {
  ArchiveType,
  ArchiveEntityFilter,
} from "../../../types/archive";

const entityOptions: {
  value: ArchiveEntityFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "leads", label: "Leads" },
  { value: "contacts", label: "Contacts" },
  { value: "deals", label: "Deals" },
  { value: "customers", label: "Customers" },
  { value: "tasks", label: "Tasks" },
  { value: "notes", label: "Notes" },
  { value: "calls", label: "Calls" },
  { value: "sms", label: "SMS" },
];

interface ArchiveRow {
  id: string;
  recordId: string;
  title: string;
  entityType: string;
  displayId: string;
  displayDate: string;
  user: string;
}

const columns: GridColDef<ArchiveRow>[] = [
  {
    field: "title",
    headerName: "Record",
    flex: 1.6,
    minWidth: 180,
    display: "flex",
    renderCell: ({ row }) => (
      <Typography
        variant="body2"
        fontWeight={600}
        noWrap
      >
        {row.title}
      </Typography>
    ),
  },
  {
    field: "entityType",
    headerName: "Type",
    flex: 1,
    minWidth: 120,
    display: "flex",
    renderCell: ({ value }) => (
      <Chip
        label={value}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    ),
  },
  {
    field: "displayId",
    headerName: "ID",
    flex: 1,
    minWidth: 120,
    display: "flex",
    renderCell: ({ value }) => (
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
      >
        {value || "—"}
      </Typography>
    ),
  },
  {
    field: "displayDate",
    headerName: "Date",
    flex: 1.2,
    minWidth: 160,
    display: "flex",
    renderCell: ({ value }) => (
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
      >
        {value || "—"}
      </Typography>
    ),
  },
  {
    field: "user",
    headerName: "By",
    flex: 1,
    minWidth: 140,
    display: "flex",
    renderCell: ({ value }) => (
      <Typography
        variant="body2"
        noWrap
      >
        {value || "—"}
      </Typography>
    ),
  },
];

export default function Archives() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items,
    type,
    entity,
    search,
    page,
    limit,
    loading,
    error,
  } = useSelector((state: RootState) => state.archives);

  const [restoreDialog, setRestoreDialog] = useState<{
    open: boolean;
    item: ArchiveRow | null;
  }>({
    open: false,
    item: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const [successDialog, setSuccessDialog] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    dispatch(
      fetchArchives({
        type,
        entity,
        search,
        page,
        limit,
      })
    );
  }, [
    dispatch,
    type,
    entity,
    search,
    page,
    limit,
  ]);

  const handleRestore = async () => {
    if (!restoreDialog.item) return;

    const result = await dispatch(
      restoreRecord({
        entity: restoreDialog.item.entityType,
        id: restoreDialog.item.recordId,
        type,
      })
    );

    if (restoreRecord.fulfilled.match(result)) {
      setRestoreDialog({
        open: false,
        item: null,
      });

      setSuccessDialog({
        open: true,
        message: "Record restored successfully",
      });
    }
  };

  const handleTypeChange = (
    _event: React.SyntheticEvent,
    value: ArchiveType
  ) => {
    dispatch(setArchiveType(value));
  };

  console.log(
    "ARCHIVE ITEM:",
    JSON.stringify(items[0], null, 2)
  );

  const rows: ArchiveRow[] = items.map((item) => {
    const date =
      type === "archived"
        ? item.archivedAt
        : item.deletedAt;

    const user =
      type === "archived"
        ? item.archivedBy
        : item.deletedBy;

    return {
      id: `${item.entityType}-${item.id}`,
      recordId: item.id,
      title: item.title,
      entityType: item.entityType,
      displayId: item.displayId || "",
      displayDate: date
        ? new Date(date).toLocaleString()
        : "",
      user: user?.displayName || "",
    };
  });

  const gridColumns: GridColDef<ArchiveRow>[] = [
    ...columns,
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      display: "flex",
      renderCell: ({ row }) => {
        const item = items.find(
          (archive) =>
            `${archive.entityType}-${archive.id}` === row.id
        );

        if (!item) return null;

        return type === "archived" ? (
          <Tooltip title="Restore">
            <IconButton
              size="small"
              onClick={() => {
                setRestoreDialog({
                  open: true,
                  item: row,
                });
              }}
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Restore">
              <IconButton
                size="small"
                onClick={() => {
                  setRestoreDialog({
                    open: true,
                    item: row,
                  });
                }}
              >
                <RestoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete permanently">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: "Permanent delete is coming soon.",
                  });
                }}
              >
                <DeleteForeverIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        mx: { xs: 1, sm: 2 },
        height: {
          xs: "calc(100vh - 120px)",
          sm: "calc(100vh - 100px)",
          md: 850,
        },
        minHeight: {
          xs: 500,
          md: 850,
        },
      }}
    >

      {error && (
        <Box sx={{ px: { xs: 1, sm: 2 }, mb: 1 }}>
          <ErrorAlert message={error} />
        </Box>
      )}
      {/* Toolbar */}
      <Box
        sx={{
          px: { xs: 1, sm: 2 },
          pb: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Row 1: title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: { xs: 1.25, sm: 1.5 },
          }}
        >
          <Box>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.3rem",
                  md: "1.5rem",
                },
              }}
            >
              Archives
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            >
              Manage archived and deleted records.
            </Typography>
          </Box>
        </Box>

        {/* Row 2: tabs + filters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
            flexWrap: "wrap",
          }}
        >
          <Tabs
            value={type}
            onChange={handleTypeChange}
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                minHeight: 40,
                px: { xs: 1.5, sm: 2 },
              },
            }}
          >
            <Tab
              label="Archived"
              value="archived"
            />

            <Tab
              label="Deleted"
              value="deleted"
            />
          </Tabs>

          <TextField
            select
            label="Entity"
            value={entity}
            onChange={(event) =>
              dispatch(
                setArchiveEntity(
                  event.target.value as ArchiveEntityFilter
                )
              )
            }
            size="small"
            sx={{
              minWidth: {
                xs: 140,
                sm: 160,
              },
            }}
          >
            {entityOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Search"
            value={search}
            onChange={(event) =>
              dispatch(
                setArchiveSearch(event.target.value)
              )
            }
            size="small"
            placeholder="Search archives..."
            sx={{
              flex: 1,
              minWidth: {
                xs: "100%",
                sm: 220,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      {/* Data grid */}
      <Paper
        sx={{
          px: {
            xs: 0,
            sm: 1,
            md: 2,
          },
          pt: 0,
          minWidth: 0,
          width: "100%",
          display: "flex",
          flex: 1,
          minHeight: 400,
          borderRadius: {
            xs: 2,
            sm: 3,
          },
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={gridColumns}
          loading={loading}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 25,
              },
            },
          }}
          pageSizeOptions={[25, 50]}
          rowHeight={40}
          sx={{
            flex: 1,
            minWidth: 0,
            border: "none",
            borderRadius: {
              xs: "0 0 8px 8px",
              sm: "0 0 12px 12px",
            },
            fontSize: {
              xs: "0.75rem",
              sm: "0.85rem",
            },
            overflow: "hidden",

            "& .MuiDataGrid-main": {
              overflow: "hidden",
            },

            "& .MuiDataGrid-columnHeaders": {
              fontWeight: 700,
              position: "sticky",
              top: 0,
              zIndex: 2,
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
            },

            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within":
              {
                outline: "none",
              },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">
                  No {type} records found.
                </Typography>
              </Box>
            ),
          }}
        />
      </Paper>
      <Dialog
        open={restoreDialog.open}
        onClose={() =>
          setRestoreDialog({
            open: false,
            item: null,
          })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Restore record?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to restore{" "}
            <strong>{restoreDialog.item?.title}</strong>?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            This record will be moved back to your active records.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setRestoreDialog({
                open: false,
                item: null,
              })
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleRestore}
            disabled={loading}
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={successDialog.open}
        onClose={() =>
          setSuccessDialog({
            open: false,
            message: "",
          })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Success
        </DialogTitle>

        <DialogContent>
          <Typography>
            {successDialog.message}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() =>
              setSuccessDialog({
                open: false,
                message: "",
              })
            }
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            open: false,
            message: "",
          })
        }
        message={snackbar.message}
      />
    </Box>
  );
}
