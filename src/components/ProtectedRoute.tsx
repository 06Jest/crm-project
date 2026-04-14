import  { useAuthContext } from '../hooks/useAuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'

export default function ProtectedRoute() {
  const { session, loading } = useAuthContext();

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

  if(!session) {
    return <Navigate to="login" replace />
  }

  return <Outlet />
}