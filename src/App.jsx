import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import MainLayout from './components/common/MainLayout/MainLayout.jsx';

import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/PatientsPage/PatientsPage';
import Doctors from './pages/MedecinsPage/MedecinsPage';
import Appointments from './pages/RendezVousPage/RendezVousPage.jsx';
import MessagesPage from './pages/MessagesPage/MessagesPage';

export default function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        

          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
