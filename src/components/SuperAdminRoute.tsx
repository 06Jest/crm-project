// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../store/store';
// import LoadingSpinner from './LoadingSpinner';

// export default function SuperAdminRoute() {
//   const { user, isAuthenticated, loading } = useSelector(
//     (state: RootState) => state.superAdmin
//   );

//   if (loading) return <LoadingSpinner />;

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/admin-auth/login" replace />;
//   }

//   if (user.role !== 'super_admin') {
//     return <Navigate to="/admin-auth/login" replace />;
//   }

//   return <Outlet />;
// }