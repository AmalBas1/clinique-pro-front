import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import MainLayout from './components/common/Mainlayout/MainLayout';

import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/PatientsPage/PatientsPage';
import Doctors from './pages/MedecinsPage/MedecinsPage';
import Appointments from './pages/RendezVousPage/RendezVousPage';
import MessagesPage from './pages/MessagesPage/MessagesPage';
import RegisterUserPage from './pages/RegisterUserPage/RegisterUserPage'; 
import PatientProfilePage from './pages/PatientProfilePage/PatientProfilePage'; 
import MedecinProfilePage from './pages/MedecinProfilePage/MedecinProfilePage'; 

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
          
          <Route path="/register-user" element={<RegisterUserPage />} />

          <Route path="/patients/profile" element={<PatientProfilePage />} />
          <Route path="/medecins/profile" element={<MedecinProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}