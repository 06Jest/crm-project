import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { user, loading} = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress/>
      </Box>
    )
  }

  if(!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}