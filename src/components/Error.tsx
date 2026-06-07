import { useEffect, useState } from 'react';
import {
  Alert,
  Collapse,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorAlertProps {
  message: string;
  title?: string;
  duration?: number;
}

export default function ErrorAlert({
  message,
  title = 'Error',
  duration = 5000,
}: ErrorAlertProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <Collapse in={open}>
      <Box sx={{ mb: 2, width: 250  }}>
        <Alert
          severity="error"
          variant="filled"
          elevation={6}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            borderRadius: 3,
            fontWeight: 500,
            boxShadow: 3,
          }}
        >
          {title}: {message}
        </Alert>
      </Box>
    </Collapse>
  );
}