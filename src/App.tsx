import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/app/Dashboard/Dashboard';
import AppLayout from './layout/Applayout';
import Contacts from './pages/app/Contacts/Contacts';
import Leads from './pages/app/Leads/Leads';
import Settings from './pages/app/Settings/Settings';


function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App;
