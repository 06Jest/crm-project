import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface AdminGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AdminGuard({
  children,
  redirectTo = '/app/dashboard',
}: AdminGuardProps) {
  const { isAdmin, loading } = useAuth();


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if ( !isAdmin ) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}