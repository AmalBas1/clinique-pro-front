import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function ChatWindow({ selectedRdv, currentUserRole }) {
    const [messages, setMessages] = useState([]);
    const [contenu, setContenu] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [correspondantName, setCorrespondantName] = useState('');

    useEffect(() => {
        if (!selectedRdv) return;

        const token = localStorage.getItem('token');

        const fetchCorrespondantName = async () => {
            try {
                if (currentUserRole === 'MEDECIN' && selectedRdv.patientId) {
                    const res = await fetch(`/api/patients/${selectedRdv.patientId}`, {
                        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCorrespondantName(`Patient : ${data.prenom || ''} ${data.nom || ''}`);
                    }
                } else if (currentUserRole === 'PATIENT' && selectedRdv.medecinId) {
                    const res = await fetch(`/api/medecins/${selectedRdv.medecinId}`, {
                        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCorrespondantName(`Dr. ${data.prenom || ''} ${data.nom || ''} ${data.specialite ? `- ${data.specialite}` : ''}`);
                    }
                }
            } catch (err) {
                console.error("Erreur chargement nom correspondant", err);
            }
        };

        fetchCorrespondantName();

        fetch(`/api/messages/rendez-vous/${selectedRdv.id}`, {
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
            setMessages(Array.isArray(data) ? data : (data.content || []));
        })
        .catch(err => console.error("Erreur chargement messages :", err));

        const socket = new SockJS('http://localhost:8080/ws-clinique');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/rendez-vous/${selectedRdv.id}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, newMessage]);
                });
            },
            onStompError: (frame) => {
                console.error('Erreur STOMP : ' + frame.headers['message']);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [selectedRdv, currentUserRole]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!contenu.trim() || !selectedRdv) return;

        const token = localStorage.getItem('token');
        const messageDTO = {
            contenu: contenu,
            expediteurRole: currentUserRole,
            rendezVousId: selectedRdv.id
        };

        fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageDTO)
        })
        .then(res => {
            if (!res.ok) throw new Error("Erreur lors de l'envoi du message");
            return res.json();
        })
        .then(() => {
            setContenu('');
        })
        .catch(err => console.error(err));
    };

}

    if (!selectedRdv) {
        return (
            <div className="chat-placeholder">
                Sélectionnez une conversation pour commencer à discuter.
            </div>
        );
    }

    const chatHeaderTitle = correspondantName || `Discussion - Rendez-vous #${selectedRdv.id}`;

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h4>{chatHeaderTitle}</h4>
            </div>

            <div className="chat-messages">
                {Array.isArray(messages) && messages.map((msg) => {
                    const isMyMessage = msg.expediteurRole === currentUserRole;
                    return (
                        <div 
                            key={msg.id} 
                            className={`message-bubble ${isMyMessage ? 'sent' : 'received'}`}
                        >
                            <small style={{ display: 'block', fontSize: '10px', opacity: 0.8, marginBottom: '3px' }}>
                                {msg.expediteurRole} - {msg.dateEnvoi ? new Date(msg.dateEnvoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </small>
                            <span>{msg.contenu}</span>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
                <input 
                    type="text" 
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="message-input"
                />
                <button type="submit" className="message-submit-btn">
                    Envoyer
                </button>
            </form>
        </div>
    );
