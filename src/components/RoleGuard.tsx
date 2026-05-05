import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useRole } from '../hooks/useRole';

interface RoleGuardProps {
  children: ReactNode;

  requiredRole: 'admin' | 'super_admin';
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  requiredRole,
  redirectTo = '/app/dashboard',
}: RoleGuardProps) {
  const { isAdmin, isSuperAdmin, loading } = useRole();


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (requiredRole === 'super_admin' && !isSuperAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}