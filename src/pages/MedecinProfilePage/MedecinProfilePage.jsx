import '../PatientProfilePage/PatientProfilePage.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MedecinProfilePage() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        telephone: '',
        adresse: '',
        specialite: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const medecinId = localStorage.getItem('medecinId'); 

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/medecins/${medecinId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setFormData({
                    prenom: response.data.prenom || '',
                    nom: response.data.nom || '',
                    telephone: response.data.telephone || '',
                    adresse: response.data.adresse || '',
                    specialite: response.data.specialite || ''
                });
            } catch (err) {
                setError("Impossible de charger les informations du profil médecin.");
            } finally {
                setLoading(false);
            }
        };

        if (medecinId) {
            fetchProfile();
        } else {
            setError("ID du médecin introuvable.");
            setLoading(false);
        }
    }, [medecinId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8080/api/medecins/${medecinId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfile(response.data);
            setIsEditing(false);
            setMessage("Profil mis à jour avec succès !");
        } catch (err) {
            setError("Erreur lors de la mise à jour du profil.");
        }
    };

    const toggleDisponibilite = async () => {
        try {
            const token = localStorage.getItem('token');
            const estActuellementDisponible = profile.disponible;

            let response;

            if (estActuellementDisponible) {
                response = await axios.put(`http://localhost:8080/api/medecins/${medecinId}/indisponible`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                const updatedData = {
                    ...profile,
                    disponible: true
                };
                response = await axios.put(`http://localhost:8080/api/medecins/${medecinId}`, updatedData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            setProfile(response.data);
            setMessage("Statut de disponibilité mis à jour avec succès.");
        } catch (err) {
            setError("Erreur lors de la modification de la disponibilité.");
        }
    };

    if (loading) return <div className="profile-loading">Chargement du profil...</div>;
    if (error && !profile) return <div className="profile-error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">👨‍⚕️</div>
                    <h2>Dr. {profile?.prenom} {profile?.nom}</h2>
                    <span className="profile-badge medecin">Médecin</span>
                </div>

                {message && <div className="alert success">{message}</div>}
                {error && <div className="alert error">{error}</div>}

                {!isEditing ? (
                    <div className="profile-body">
                        <div className="profile-item">
                            <span className="label">Spécialité :</span>
                            <span className="value">{profile?.specialite || 'Non renseignée'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Téléphone :</span>
                            <span className="value">{profile?.telephone || 'Non renseigné'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Adresse / Cabinet :</span>
                            <span className="value">{profile?.adresse || 'Non renseignée'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Disponibilité :</span>
                            <span className={`value ${profile?.disponible ? 'text-success' : 'text-danger'}`}>
                                {profile?.disponible ? '🟢 Disponible' : '🔴 Indisponible'}
                            </span>
                        </div>

                        {/* Bouton pour changer la disponibilité */}
                        <button 
                            className={`btn-toggle-disp ${profile?.disponible ? 'btn-danger' : 'btn-success'}`}
                            onClick={toggleDisponibilite}
                            style={{ marginBottom: '10px', padding: '10px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', backgroundColor: profile?.disponible ? '#e74c3c' : '#2ecc71' }}
                        >
                            {profile?.disponible ? 'Marquer comme Indisponible' : 'Marquer comme Disponible'}
                        </button>

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
                            <label>Spécialité</label>
                            <input 
                                type="text" 
                                name="specialite" 
                                value={formData.specialite} 
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