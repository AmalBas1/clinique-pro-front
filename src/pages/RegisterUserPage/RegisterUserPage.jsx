import React, { useState } from 'react';
import axios from 'axios';
import './RegisterUserPage.css';

export default function RegisterUserPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        role: 'PATIENT',
        telephone: '',
        specialite: '',
        adresse: '',
        dateNaissance: ''
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/auth/register', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("Utilisateur enregistré et profil lié avec succès !");
            setFormData({
                email: '',
                password: '',
                nom: '',
                prenom: '',
                role: 'PATIENT',
                telephone: '',
                specialite: '',
                adresse: '',
                dateNaissance: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-user-container">
            <div className="register-card">
                <h2>Créer un nouveau compte</h2>
                <p className="subtitle">Ajoutez un Patient ou un Médecin avec son profil associé.</p>

                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>Rôle de l'utilisateur</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            className="form-control"
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="MEDECIN">Médecin</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nom</label>
                            <input 
                                type="text" 
                                name="nom" 
                                value={formData.nom} 
                                onChange={handleChange} 
                                required 
                                className="form-control" 
                                placeholder="Ex: Alami"
                            />
                        </div>
                        <div className="form-group">
                            <label>Prénom</label>
                            <input 
                                type="text" 
                                name="prenom" 
                                value={formData.prenom} 
                                onChange={handleChange} 
                                required 
                                className="form-control" 
                                placeholder="Ex: Mehdi"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-control" 
                            placeholder="exemple@domaine.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-control" 
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-group">
                        <label>Téléphone</label>
                        <input 
                            type="text" 
                            name="telephone" 
                            value={formData.telephone} 
                            onChange={handleChange} 
                            className="form-control" 
                            placeholder="+212 6..."
                        />
                    </div>

                    {formData.role === 'MEDECIN' && (
                        <div className="form-group animate-fade">
                            <label>Spécialité</label>
                            <input 
                                type="text" 
                                name="specialite" 
                                value={formData.specialite} 
                                onChange={handleChange} 
                                required 
                                className="form-control" 
                                placeholder="Ex: Cardiologie"
                            />
                        </div>
                    )}

                    {formData.role === 'PATIENT' && (
                        <>
                            <div className="form-group animate-fade">
                                <label>Adresse</label>
                                <input 
                                    type="text" 
                                    name="adresse" 
                                    value={formData.adresse} 
                                    onChange={handleChange} 
                                    className="form-control" 
                                    placeholder="Ville, Rue..."
                                />
                            </div>
                            <div className="form-group animate-fade">
                                <label>Date de naissance</label>
                                <input 
                                    type="date" 
                                    name="dateNaissance" 
                                    value={formData.dateNaissance} 
                                    onChange={handleChange} 
                                    className="form-control" 
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Enregistrement en cours...' : 'Créer le compte et le profil'}
                    </button>
                </form>
            </div>
        </div>
    );
}