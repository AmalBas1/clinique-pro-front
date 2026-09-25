import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(email, password);
      console.log("Données reçues de l'API de login :", data);

      if (data) {
        const token = data.token || data.accessToken;
        localStorage.setItem('token', token);
        
        const role = data.role || data.user?.role;
        localStorage.setItem('role', role);
        
        const userId = data.user?.id || data.id;
        localStorage.setItem('userId', userId);

        const prenom = data.prenom || data.user?.prenom || data.user?.nom || data.nom || 'Utilisateur';
        localStorage.setItem('userName', prenom);

        if (role === 'PATIENT' && userId) {
          try {
            const patientRes = await axios.get(`http://localhost:8080/api/patients/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (patientRes.data && patientRes.data.id) {
              localStorage.setItem('patientId', patientRes.data.id);
              console.log("PatientId stocké avec succès :", patientRes.data.id);
            }
          } catch (err) {
            console.error("Erreur lors de la récupération du patientId:", err);
          }
        }

        if ((role === 'MEDECIN' || role === 'Medecin') && userId) {
          try {
            const medecinRes = await axios.get(`http://localhost:8080/api/medecins/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (medecinRes.data && medecinRes.data.id) {
              localStorage.setItem('medecinId', medecinRes.data.id);
              console.log("MedecinId stocké avec succès :", medecinRes.data.id);
            }
          } catch (err) {
            console.error("Erreur lors de la récupération du medecinId:", err);
          }
        }
      }

      navigate('/');
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo-container">
          <div className="logo-icon-box">
            <span className="plus-sign">+</span>
          </div>
          <span className="logo-brand-text">CLINIQUEPRO</span>
        </div>

        <div className="login-header">
          <h1>Espace Praticien & Personnel</h1>
          <p>Connectez-vous pour gérer votre clinique en toute simplicité.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin} className="login-form-content">
          <div className="form-group">
            <div className="label-row">
              <label>Email</label>
              <span className="input-hint">Identifiant santé</span>
            </div>
            <div className="input-wrapper">
              <span className="field-icon">✉️</span>
              <input 
                type="email" 
                placeholder="dr.martin@cliniquepro.fr"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <span className="field-icon">🔒</span>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Se connecter →
          </button>
        </form>
      </div>

      <div className="login-footer-help">
        Besoin d'une assistance technique ? Contactez le support dédié au <strong>01 80 90 20 00</strong>
      </div>
    </div>
  );
}