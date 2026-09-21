import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    login(email, password)
      .then((data) => {
        navigate('/');
      })
      .catch((err) => {
        setError('Email ou mot de passe incorrect.');
      });
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