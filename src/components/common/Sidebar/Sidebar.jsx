import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isAdmin = userRole === 'ADMIN';
  const isMedecin = userRole === 'MEDECIN';
  const isPatient = userRole === 'PATIENT';

  return (
    <aside className="sidebar">
      <div className="sidebar-top-section">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon">+</div>
          <div className="sidebar-logo-texts">
            <span className="brand-name">CliniquePro</span>
            <span className="brand-tagline">SANTÉ CONNECTÉE</span>
          </div>
        </div>

        <span className="nav-practice-title">NAVIGATION PRATIQUE</span>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📊</span>
            <span>Tableau de bord</span>
          </NavLink>

          {!isPatient && (
            <NavLink 
              to="/patients" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">👥</span>
              <span>Patients</span>
            </NavLink>
          )}

          <NavLink 
            to="/doctors" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">👨‍⚕️</span>
            <span>Médecins</span>
          </NavLink>

          <NavLink 
            to="/appointments" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📅</span>
            <span>Rendez-vous</span>
          </NavLink>

          <NavLink 
            to="/messages" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </NavLink>

          {isAdmin && (
            <NavLink 
              to="/register-user" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">➕</span>
              <span>Admin</span>
            </NavLink>
          )}

          {!isAdmin && (
            <NavLink 
              to={isMedecin ? '/medecins/profile' : '/patients/profile'} 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <span className="nav-icon">👤</span>
              <span>Mon profil</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}