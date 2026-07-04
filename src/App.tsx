import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import { initializeAnalytics, trackPageView, setAnalyticsUser } from './services/googleAnalyticsService';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { useEffect } from 'react';

import PublicLayout from './layout/PublicLayout';
import AuthLayout from './layout/AuthLayout';
import AppLayout from './layout/AppLayout';


import RoleGuard from './components/RoleGuard';
import Landing from './pages/public/Landing/Landing';
import Pricing from './pages/public/Pricing/Pricing';
import About from './pages/public/About/About';


import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';


import Dashboard from './pages/app/Dashboard/Dashboard';
import Contacts from './pages/app/Contacts/Contacts';
import ContactDetail from './pages/app/Contacts/ContactDetails';
import Leads from './pages/app/Leads/Leads';
import Deals from './pages/app/Deals/Deals';
import AddDeal from './pages/app/Deals/AddDeal'
import AddLead from './pages/app/Leads/AddLead';
import Activities from './pages/app/Activities/Activities';
import Customers from './pages/app/Customers/Customers';
import AddContact from './pages/app/Contacts/AddContact';
import CustomerLeaderboard from './pages/app/Customers/CustomerLeaderboard';
import CustomerDetail from './pages/app/Customers/CustomerDetail';
import Reports from './pages/app/Reports/Reports';
import Profile from './pages/app/Profile/Profile';
import Messaging from './pages/app/Messaging/Messaging';
import Settings from './pages/app/Settings/Settings';
import Analytics from './pages/app/Analytics/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/auth/ForgotPassword/ResetPassword';
import CompanyProfile from './pages/app/Company/CompanyProfile';
import SuperAdminRoute from './components/SuperAdminRoute';
import SuperAdminLayout from './layout/SuperAdminLayout';
import SuperAdminLogin from './pages/admin-auth/SuperAdminLogin';
import SuperAdminDashboard from './pages/admin/Dashboard/SuperAdminDashboard';
import AdminUsers from './pages/admin/AdminUsers/AdminUsers';
import AdminAccounts from './pages/admin/AdminAccounts/AdminAccounts';
import { useSidebar } from '../src/hooks//useSidebar';


function AppRoutes() {
  const location = useLocation();
  const superAdmin = useSelector((state: RootState) => state.superAdmin.user);  
 
 const { collapsed, setCollapsed } = useSidebar(); 

  

  useEffect(() => {  
    if (!collapsed) {
    setCollapsed(true);
  }
    trackPageView(location.pathname);
  }, [location.pathname]);
  useEffect(() => {
    if (superAdmin) {
      setAnalyticsUser(superAdmin.id, superAdmin.role);
    }
  }, [superAdmin]);

  return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Route>

        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        
        <Route element={<ProtectedRoute/>}>
          <Route element={<AppLayout />}>
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/leads" element={<Leads />} />
            <Route path="/app/addlead" element={<AddLead />} />
            <Route path="/app/contacts" element={<Contacts />} />
            <Route path="/app/addcontact" element={<AddContact />} />
            <Route path="/app/contacts/:id" element={<ContactDetail />} />
            <Route path="/app/deals" element={<Deals />} />
            <Route path="/app/adddeal" element={<AddDeal />} />
            <Route path="/app/activities" element={<Activities />} />
            <Route path="/app/customers" element={<Customers />} />
            <Route path="/app/customers/leaderboard" element={<CustomerLeaderboard />} />
            <Route path="/app/customers/:id" element={<CustomerDetail />} />
            <Route path="/app/reports" element={<Reports />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/company/:id" element={<CompanyProfile />} />
            <Route path="/app/messaging" element={<Messaging />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route
          path="/app/reports"
          element={
            <RoleGuard requiredRole="admin">
              <Reports />
            </RoleGuard>
          }
        />
        <Route
          path="/app/settings"
          element={
            <RoleGuard requiredRole="admin">
              <Settings />
            </RoleGuard>
          }
        />

        
        <Route path="/admin-auth/login" element={<SuperAdminLogin />} />

        <Route path="/admin/*" element={<SuperAdminRoute />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="accounts" element={<AdminAccounts />} />
          </Route>
      </Route>
      </Routes> 
  );
}
function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
