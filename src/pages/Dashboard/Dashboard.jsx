import { useState, useEffect } from 'react'
import { CalendarDays, CalendarClock, Mail, Plus, UsersRound, Stethoscope, CheckCircle2, Loader2, UserCheck } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
    const [user, setUser] = useState({ 
        name: localStorage.getItem('userName') || 'Utilisateur', 
        role: localStorage.getItem('role') || 'PATIENT',
        id: localStorage.getItem('userId') || localStorage.getItem('id') || 1
    })
    const [stats, setStats] = useState({ 
        mainStatLabel: 'Total Patients', 
        mainStatValue: 0, 
        appointments: 0, 
        messages: 0 
    })
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('accessToken')
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }

        const userRole = localStorage.getItem('role') || 'PATIENT';
        const userId = localStorage.getItem('userId') || localStorage.getItem('id');

        if (userRole === 'PATIENT') {
            setStats(prev => ({ ...prev, mainStatLabel: 'Mes Consultations' }))
        } else if (userRole === 'MEDECIN') {
            setStats(prev => ({ ...prev, mainStatLabel: 'Mes Patients' }))
        }

        let rdvUrl = '/api/rendezvous/count'; 
        if (userRole === 'PATIENT' && userId) {
            rdvUrl = `/api/rendezvous/patient/${userId}?size=1`;
        } else if (userRole === 'MEDECIN' && userId) {
            rdvUrl = `/api/rendezvous/medecin/${userId}?size=1`;
        }

        let messageUrl = '/api/messages/count';
        if (userRole === 'PATIENT' && userId) {
            messageUrl = `/api/messages/count/patient/${userId}`;
        } else if (userRole === 'MEDECIN' && userId) {
            messageUrl = `/api/messages/count/medecin/${userId}`;
        }

        fetch('/api/patients/count', { headers })
            .then(res => res.ok ? res.json() : 0)
            .then(totalPatients => {
                setStats(prev => ({ ...prev, mainStatValue: totalPatients }))

                return fetch(rdvUrl, { headers })
            })
            .then(res => res.ok ? res.json() : 0)
            .then(rdvData => {
                const totalRdv = typeof rdvData === 'number' ? rdvData : (rdvData.totalElements || 0);
                setStats(prev => ({ ...prev, appointments: totalRdv }))

                return fetch(messageUrl, { headers })
            })
            .then(res => res.ok ? res.json() : 0)
            .then(unreadMessages => {
                setStats(prev => ({ ...prev, messages: unreadMessages }))

                return fetch('/api/medecins/disponibles', { headers })
            })
            .then(res => res.ok ? res.json() : [])
            .then(docData => {
                const rawList = docData.content || docData
                const formattedDoctors = rawList.map((doc, index) => ({
                    id: doc.id || index + 1,
                    name: `Dr. ${doc.nom || 'Inconnu'}`,
                    specialty: doc.specialite || 'Généraliste',
                    status: doc.disponible !== false ? 'Disponible' : 'Indisponible',
                    avatar: doc.nom ? doc.nom.slice(0, 2).toUpperCase() : 'DR'
                }))
                setDoctors(formattedDoctors)
            })
            .catch(error => {
                console.error("Erreur lors du chargement du dashboard :", error)
            })
            .finally(() => {
                setLoading(false)
            })

    }, [])

    if (loading) {
        return (
            <div className="dashboard-loading" style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin" size={40} color="#006c9e" />
            </div>
        )
    }

    return (
        <section className="dashboard-page">
            <header className="dashboard-header">
                <div className="dashboard-intro">
                    <h1>Bonjour {user.name} <span aria-hidden="true">👋</span></h1>
                    <div className="dashboard-meta">
                        <span className="meta-separator" aria-hidden="true" />
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="new-appointment-button" type="button">
                        <Plus aria-hidden="true" />
                        <span>{user.role === 'PATIENT' ? 'Prendre un RDV' : 'Nouveau RDV'}</span>
                    </button>
                </div>
            </header>

            <div className="dashboard-grid">
                {user.role !== 'PATIENT' && (
                    <article className="dashboard-card">
                        <div className="card-heading">
                            <h2>{stats.mainStatLabel}</h2>
                            <span className="card-icon">
                                {user.role === 'PATIENT' ? <UserCheck aria-hidden="true" /> : <UsersRound aria-hidden="true" />}
                            </span>
                        </div>
                        <div className="card-value-row">
                            <strong>{stats.mainStatValue}</strong>
                        </div>
                        <div className="progress-track">
                            <span className="progress-value progress-patients" style={{ width: `${Math.min(stats.mainStatValue * 10, 100)}%` }} />
                        </div>
                    </article>
                )}

                <article className="dashboard-card">
                    <div className="card-heading">
                        <h2>{user.role === 'ADMIN' ? 'Total des Rendez-vous' : 'Total de vos RDVs'}</h2>
                        <span className="card-icon"><CalendarClock aria-hidden="true" /></span>
                    </div>
                    <div className="card-value-row">
                        <strong>{stats.appointments}</strong>
                        <span>consultations</span>
                    </div>
                    <div className="progress-track">
                        <span className="progress-value progress-appointments" style={{ width: `${Math.min(stats.appointments * 10, 100)}%` }} />
                    </div>
                </article>

                <article className="dashboard-card dashboard-card-messages">
                    <div className="card-heading">
                        <h2>Messages reçus</h2>
                        <span className="card-icon"><Mail aria-hidden="true" /></span>
                    </div>
                    <div className="card-value-row">
                        <strong>{stats.messages}</strong>
                        <span>messages reçus</span>
                    </div>
                    <div className="progress-track">
                        <span className="progress-value progress-messages" style={{ width: `${Math.min(stats.messages * 15, 100)}%` }} />
                    </div>
                </article>
            </div>

            <div className="dashboard-section">
                <div className="section-header-row">
                    <h2>Médecins disponibles</h2>
                    <span className="section-badge"><Stethoscope size={16} /> Équipe active ({doctors.length})</span>
                </div>

                <div className="doctors-grid">
                    {doctors.length === 0 ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '20px' }}>
                            Aucun médecin disponible trouvé.
                        </p>
                    ) : (
                        doctors.map((doc) => (
                            <div key={doc.id} className="doctor-card">
                                <div className="doctor-avatar">{doc.avatar}</div>
                                <div className="doctor-info">
                                    <span className="doctor-name">{doc.name}</span>
                                    <span className="doctor-specialty">{doc.specialty}</span>
                                </div>
                                <div className={`doctor-status ${doc.status === 'Disponible' ? 'available' : 'busy'}`}>
                                    <CheckCircle2 size={12} />
                                    <span>{doc.status}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}