import { Routes, Route, useLocation} from 'react-router-dom';
import { useEffect } from 'react';

import PublicLayout from './layout/PublicLayout';
import AuthLayout from './layout/AuthLayout';
import AppLayout from './layout/AppLayout';

import Landing from './pages/public/Landing/Landing';
import Pricing from './pages/public/Pricing/Pricing';
import AboutUs from './pages/public/AboutUs/AboutUs';
import Feedback from './pages/public/Feedback/Feedback';
import Health from './pages/public/SystemHealth/SystemHealth';
import Approval from "./pages/auth/Approval/Approval";
import Onboarding from "./pages/auth/OnBoarding/Onboarding";
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import AuthCallback from './pages/auth/AuthCallback/AuthCallback';

import Dashboard from './pages/app/Dashboard/Dashboard';
import Contacts from './pages/app/Contacts/Contacts';
import AddContact from './pages/app/Contacts/AddContact';
import ContactDetail from './pages/app/Contacts/ContactDetails';
import Leads from './pages/app/Leads/Leads';
import LeadDetail from './pages/app/Leads/LeadDetails';
import Deals from './pages/app/Deals/Deals';
import AddDeal from './pages/app/Deals/AddDeal'
import AddLead from './pages/app/Leads/AddLead';
import Activities from './pages/app/Activities/Activities';
import Customers from './pages/app/Customers/Customers';
import CustomerDetail from './pages/app/Customers/CustomerDetail';
import Profile from './pages/app/Profile/Profile';
import Workspace from './pages/app/Workspace/Workspace';
import Settings from './pages/app/Settings/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/auth/ForgotPassword/ResetPassword';
import { useSidebar } from '../src/hooks//useSidebar';
import AddDealByID from './pages/app/Deals/AddDealByID';
import ProductOverview from './pages/public/ProductOverview/ProductOverview';
import TermsOfService from './pages/public/TermsOfService/Terms';
import PrivacyPolicy from './pages/public/Privacy/Privacy';
import Security from './pages/public/Security/Security';
import RoadmapPage from './pages/public/Roadmap/Roadmap';
import HelpCenterPage from './pages/public/Help/Help';
import NotFoundPage from './pages/NotFound/NotFound';
import CookiePolicyPage from './pages/public/CookiePolicy/CookiePolicy';



function AppRoutes() {
  const location = useLocation();
  const { setCollapsed } = useSidebar(); 



  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname, setCollapsed]);

  return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/overview" element={<ProductOverview />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/security" element={<Security />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/cookiepolicy" element={<CookiePolicyPage />} />
          <Route path="/health" element={<Health />} />
        </Route>

        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        
        <Route element={<ProtectedRoute/>}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/approval" element={<Approval />} />          
          <Route element={<AppLayout />}>
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/leads" element={<Leads />} />
            <Route path="/app/leads/addlead" element={<AddLead />} />
            <Route path="/app/leads/:id" element={<LeadDetail />} />
            <Route path="/app/contacts" element={<Contacts />} />
            <Route path="/app/contacts/addcontact" element={<AddContact />} />
            <Route path="/app/contacts/:id" element={<ContactDetail />} />
            <Route path="/app/deals" element={<Deals />} />
            <Route path="/app/deals/adddeal" element={<AddDeal />} />
            <Route path="/app/deals/adddeal/:id" element={<AddDealByID />} />
            <Route path="/app/activities" element={<Activities />} /> 
            <Route path="/app/customers" element={<Customers />} />
            <Route path="/app/customers/:id" element={<CustomerDetail />} /> 
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/workspace" element={<Workspace />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes> 
  );
}
function App() {
  return (
      <AppRoutes />
  );
}

export default App;
