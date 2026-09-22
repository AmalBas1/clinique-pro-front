import React, { useState, useEffect } from 'react';

export default function ConversationList({ rendezVousList, selectedRdv, onSelectRdv, currentUserRole }) {
    const safeList = Array.isArray(rendezVousList) ? rendezVousList : [];
    const [namesMap, setNamesMap] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchNames = async () => {
            const newMap = { ...namesMap };
            for (const rdv of safeList) {
                if (currentUserRole === 'MEDECIN' && rdv.patientId && !newMap[`patient_${rdv.patientId}`]) {
                    try {
                        const res = await fetch(`/api/patients/${rdv.patientId}`, {
                            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            newMap[`patient_${rdv.patientId}`] = `${data.prenom || ''} ${data.nom || ''}`.trim();
                        }
                    } catch (e) {
                        console.error("Erreur chargement patient", e);
                    }
                } else if (currentUserRole === 'PATIENT' && rdv.medecinId && !newMap[`medecin_${rdv.medecinId}`]) {
                    try {
                        const res = await fetch(`/api/medecins/${rdv.medecinId}`, {
                            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            newMap[`medecin_${rdv.medecinId}`] = `Dr. ${data.prenom || ''} ${data.nom || ''}`.trim();
                        }
                    } catch (e) {
                        console.error("Erreur chargement medecin", e);
                    }
                }
            }
            setNamesMap(newMap);
        };

        if (safeList.length > 0) {
            fetchNames();
        }
    }, [safeList, currentUserRole]);

    return (
        <div className="conversation-list">
            <h3>Conversations</h3>
            {safeList.length > 0 ? (
                safeList.map((rdv) => {
                    let displayName = `Rendez-vous #${rdv.id}`;
                    if (currentUserRole === 'MEDECIN' && rdv.patientId) {
                        displayName = namesMap[`patient_${rdv.patientId}`] || `Patient #${rdv.patientId}`;
                    } else if (currentUserRole === 'PATIENT' && rdv.medecinId) {
                        displayName = namesMap[`medecin_${rdv.medecinId}`] || `Dr. #${rdv.medecinId}`;
                    }

                    return (
                        <div 
                            key={rdv.id} 
                            onClick={() => onSelectRdv(rdv)}
                            className={`conversation-item ${selectedRdv?.id === rdv.id ? 'active' : ''}`}
                        >
                            <strong>{displayName}</strong>
                            <p className="conversation-date">
                                {rdv.dateRendezVous ? new Date(rdv.dateRendezVous).toLocaleString() : 'Date non disponible'}
                            </p>
                        </div>
                    );
                })
            ) : (
                <p style={{ color: '#64748b' }}>Aucune conversation disponible.</p>
            )}
        </div>
    );
}