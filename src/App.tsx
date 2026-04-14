import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import PublicLayout from './layout/PublicLayout';
import AuthLayout from './layout/AuthLayout';
import AppLayout from './layout/AppLayout';



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
import Activities from './pages/app/Activities/Activities';
import Customers from './pages/app/Customers/Customers';
import Analytics from './pages/app/Analytics/Analytics';
import Profile from './pages/app/Profile/Profile';
import Settings from './pages/app/Settings/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
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
        </Route>

        
        <Route element={<ProtectedRoute/>}>
          <Route element={<AppLayout />}>
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/contacts" element={<Contacts />} />
            <Route path="/app/contacts/:id" element={<ContactDetail />} />
            <Route path="/app/leads" element={<Leads />} />
            <Route path="/app/deals" element={<Deals />} />
            <Route path="/app/activities" element={<Activities />} />
            <Route path="/app/customers" element={<Customers />} />
            <Route path="/app/analytics" element={<Analytics />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
