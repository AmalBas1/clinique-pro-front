import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientProfilePage.css';

export default function PatientProfilePage() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        telephone: '',
        adresse: '',
        dateNaissance: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const patientId = localStorage.getItem('patientId'); 

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/patients/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setFormData({
                    prenom: response.data.prenom || '',
                    nom: response.data.nom || '',
                    telephone: response.data.telephone || '',
                    adresse: response.data.adresse || '',
                    dateNaissance: response.data.dateNaissance || ''
                });
            } catch (err) {
                setError("Impossible de charger les informations du profil.");
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchProfile();
        } else {
            setError("ID du patient introuvable.");
            setLoading(false);
        }
    }, [patientId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8080/api/patients/${patientId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfile(response.data);
            setIsEditing(false);
            setMessage("Profil mis à jour avec succès !");
        } catch (err) {
            setError("Erreur lors de la mise à jour du profil.");
        }
    };

    if (loading) return <div className="profile-loading">Chargement du profil...</div>;
    if (error && !profile) return <div className="profile-error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">👤</div>
                    <h2>{profile?.prenom} {profile?.nom}</h2>
                    <span className="profile-badge patient">Patient</span>
                </div>

                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                {!isEditing ? (
                    <div className="profile-body">
                        <div className="profile-item">
                            <span className="label">Prénom :</span>
                            <span className="value">{profile?.prenom || 'Non renseigné'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Nom :</span>
                            <span className="value">{profile?.nom || 'Non renseigné'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Téléphone :</span>
                            <span className="value">{profile?.telephone || 'Non renseigné'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Adresse :</span>
                            <span className="value">{profile?.adresse || 'Non renseignée'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Date de naissance :</span>
                            <span className="value">{profile?.dateNaissance || 'Non renseignée'}</span>
                        </div>

                        <button 
                            className="btn-edit" 
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier mes informations
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group">
                            <label>Prénom</label>
                            <input 
                                type="text" 
                                name="prenom" 
                                value={formData.prenom} 
                                onChange={handleChange} 
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom</label>
                            <input 
                                type="text" 
                                name="nom" 
                                value={formData.nom} 
                                onChange={handleChange} 
                                className="form-control"
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
                            />
                        </div>
                        <div className="form-group">
                            <label>Adresse</label>
                            <input 
                                type="text" 
                                name="adresse" 
                                value={formData.adresse} 
                                onChange={handleChange} 
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Date de naissance</label>
                            <input 
                                type="date" 
                                name="dateNaissance" 
                                value={formData.dateNaissance} 
                                onChange={handleChange} 
                                className="form-control"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">Enregistrer</button>
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={() => setIsEditing(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}