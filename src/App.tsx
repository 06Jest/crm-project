import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './layout/Mainlayout';
import Contacts from './pages/Contacts/Contacts';
import Leads from './pages/Leads/Leads';
import Settings from './pages/Settings';


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App;
