import { useEffect, useState } from 'react';
import {
  Alert,
  Collapse,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SuccessAlertProps {
  message: string;
  duration?: number;
}

export default function SuccessAlert({
  message,
  duration = 3000,
}: SuccessAlertProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // or "auto"
    });
    const timer = setTimeout(() => {
      setOpen(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <Collapse in={open}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'  }}>
        <Alert
          severity="success"
          variant="outlined"
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
            width: '100%',
          }}
        >
          {message}
        </Alert>
      </Box>
    </Collapse>
  );
}