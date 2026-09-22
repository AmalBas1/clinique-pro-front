import React, { useState, useEffect } from 'react';
import ConversationList from '../../components/messages/ConversationList/ConversationList';
import ChatWindow from '../../components/messages/ChatWindow/ChatWindow';
import './MessagesPage.css';

export default function MessagePage() {
    const [rendezVousList, setRendezVousList] = useState([]);
    const [selectedRdv, setSelectedRdv] = useState(null);
    
    const currentUserRole = (localStorage.getItem('role') || 'MEDECIN').toUpperCase(); 
    const userId = localStorage.getItem('userId');
    
    const medecinId = localStorage.getItem('medecinId') || userId;
    const patientId = localStorage.getItem('patientId') || userId;

    useEffect(() => {
        let url = '/api/rendezvous'; 

        if (currentUserRole === 'PATIENT' && patientId) {
            url = `/api/rendezvous/patient/${patientId}`;
        } else if (currentUserRole === 'MEDECIN' && medecinId) {
            url = `/api/rendezvous/medecin/${medecinId}`;
        }

        const token = localStorage.getItem('token');

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erreur HTTP ${res.status}: ${errorText}`);
            }
            return res.json();
        })
        .then(data => {
    const list = data.content || data;
    console.log("Données brutes des rendez-vous reçues du backend :", list);
    setRendezVousList(list);
})
        .catch(err => console.error("Erreur chargement rendez-vous :", err));
    }, [currentUserRole, userId, medecinId, patientId]);

    return (
        <div className="message-page-container">
            <ConversationList 
                rendezVousList={rendezVousList} 
                selectedRdv={selectedRdv} 
                onSelectRdv={setSelectedRdv} 
                currentUserRole={currentUserRole}
            />
            <ChatWindow 
                selectedRdv={selectedRdv} 
                currentUserRole={currentUserRole} 
            />
        </div>
    );
}