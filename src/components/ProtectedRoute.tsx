import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { user, loading, loaded} = useAuth();

  if (loading || !loaded) {
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