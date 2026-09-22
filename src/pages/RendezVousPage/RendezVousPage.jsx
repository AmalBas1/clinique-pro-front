import { useState, useEffect } from 'react'
import { Calendar, Clock, Search, Plus, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import RendezvousCard from '../../components/rendezvous/RendezVousCard/RendezVousCard'
import RendezvousTable from '../../components/rendezvous/RendezVousTable/RendezVousTable'
import RendezvousForm from '../../components/rendezvous/RendezVousForm/RendezVousForm'

export default function RendezvousPage() {
    const [rendezvous, setRendezvous] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('ALL')
    const [loading, setLoading] = useState(true)
    const [mode, setMode] = useState(null) 
    const [selectedRdv, setSelectedRdv] = useState(null)

    const userRole = localStorage.getItem('role') || JSON.parse(localStorage.getItem('user') || '{}')?.role || ''
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const currentUserId = currentUser.id || localStorage.getItem('userId')
    
    const currentPatientId = localStorage.getItem('patientId') || currentUser.patientId || currentUser.patient?.id || ''
    
    const [currentMedecinId, setCurrentMedecinId] = useState('')
    const [medecinLoading, setMedecinLoading] = useState(false)
    
    const isAdmin = userRole.toUpperCase().includes('ADMIN')
    const isMedecin = userRole.toUpperCase().includes('MEDECIN')
    const isPatient = userRole.toUpperCase().includes('PATIENT')

    const getTokenHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('accessToken')
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    useEffect(() => {
        if (isMedecin && currentUserId) {
            setMedecinLoading(true)
            fetch('/api/medecins', { headers: getTokenHeaders() })
                .then(res => res.json())
                .then(data => {
                    const medecinsList = data.content || (Array.isArray(data) ? data : [])
                    const myMedecin = medecinsList.find(m => 
                        String(m.userId) === String(currentUserId) || 
                        String(m.user?.id) === String(currentUserId) ||
                        String(m.user_id) === String(currentUserId)
                    )
                    if (myMedecin) {
                        setCurrentMedecinId(myMedecin.id)
                        localStorage.setItem('medecinId', myMedecin.id)
                        console.log("Médecin identifié avec succès, ID =", myMedecin.id)
                    } else {
                        console.warn("Aucun profil médecin trouvé pour l'utilisateur ID:", currentUserId)
                    }
                })
                .catch(err => console.error("Erreur récupération profil médecin :", err))
                .finally(() => setMedecinLoading(false))
        } else if (!isMedecin) {
            setMedecinLoading(false)
        }
    }, [isMedecin, currentUserId])

    const fetchRendezvous = async () => {
        setLoading(true)
        const endpoint = '/api/rendezvous?page=0&size=10'

        try {
            const res = await fetch(endpoint, { headers: getTokenHeaders() })
            if (!res.ok) {
                setRendezvous([])
                return
            }

            const data = await res.json()
            console.log("Données reçues de l'API :", data)
            const list = data.content || (Array.isArray(data) ? data : [])
            setRendezvous(list)
        } catch (err) {
            console.error("Erreur réseau :", err)
            setRendezvous([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin || isPatient || (isMedecin && currentMedecinId)) {
            fetchRendezvous()
        }
    }, [currentPatientId, currentMedecinId])

    const handleSaveRendezvous = (formData) => {
        const dataToSend = {
            ...formData,
            patientId: isPatient ? currentPatientId : formData.patientId,
            medecinId: isMedecin ? currentMedecinId : formData.medecinId,
            statut: mode === 'edit' ? formData.statut : 'PENDING'
        }

        const url = mode === 'edit' ? `/api/rendezvous/${selectedRdv.id}` : '/api/rendezvous'
        const method = mode === 'edit' ? 'PUT' : 'POST'

        fetch(url, {
            method: method,
            headers: getTokenHeaders(),
            body: JSON.stringify(dataToSend)
        })
        .then(res => {
            if (res.ok) {
                setMode(null)
                setSelectedRdv(null)
                fetchRendezvous()
            } else {
                alert("Erreur lors de l'enregistrement.")
            }
        })
        .catch(err => console.error("Erreur:", err))
    }

    const handleDeleteRendezvous = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) {
            fetch(`/api/rendezvous/${id}`, {
                method: 'DELETE',
                headers: getTokenHeaders()
            })
            .then(res => {
                if (res.ok) {
                    setRendezvous(prev => prev.filter(r => r.id !== id))
                } else {
                    alert("Suppression impossible.")
                }
            })
            .catch(err => console.error("Erreur suppression:", err))
        }
    }

    const handleViewClick = (rdv) => {
        setSelectedRdv(rdv)
        setMode('view')
    }

    const handleEditClick = (rdv) => {
        setSelectedRdv(rdv)
        setMode('edit')
    }

    const visibleRendezvous = rendezvous.filter(r => {
        if (isAdmin) return true; 
        if (isMedecin) {
            if (!currentMedecinId) return false; 
            const rdvMedecinId = r.medecinId || r.medecin?.id;
            return String(rdvMedecinId) === String(currentMedecinId); 
        }
        if (isPatient && currentPatientId) {
            const rdvPatientId = r.patientId || r.patient?.id;
            return String(rdvPatientId) === String(currentPatientId); 
        }
        return true;
    })

    const filteredRendezvous = visibleRendezvous.filter(r => {
        const matchesSearch = 
            String(r.patientId || r.patient?.id || '').includes(searchTerm) ||
            String(r.medecinId || r.medecin?.id || '').includes(searchTerm)
        
        if (selectedStatus === 'ALL') return matchesSearch
        return matchesSearch && r.statut === selectedStatus
    })

    const totalCount = filteredRendezvous.length
    const confirmedCount = filteredRendezvous.filter(r => r.statut === 'CONFIRMED').length
    const pendingCount = filteredRendezvous.filter(r => r.statut === 'PENDING').length
    const cancelledCount = filteredRendezvous.filter(r => r.statut === 'CANCELLED').length

    return (
        <div className="patients-page">
            <header className="patients-header-section">
                <div>
                    <span className="module-subtitle">PLANIFICATION • {filteredRendezvous.length} consultations</span>
                    <h1>Gestion des Rendez-vous</h1>
                    <p>Planification et suivi des consultations médicales.</p>
                </div>
                
                {(isAdmin || isPatient || isMedecin) && (
                    <button className="btn-add-patient" onClick={() => { 
                        setSelectedRdv(null); 
                        setMode(mode === 'add' ? null : 'add'); 
                    }}>
                        <Plus size={18} />
                        <span>{mode === 'add' ? "Fermer le formulaire" : "+ Nouveau Rendez-vous"}</span>
                    </button>
                )}
            </header>

            {mode && (
                <RendezvousForm 
                    rdvToEdit={selectedRdv} 
                    mode={mode}
                    userRole={userRole}
                    currentPatientId={currentPatientId}
                    currentMedecinId={currentMedecinId} 
                    onSubmit={handleSaveRendezvous} 
                    onCancel={() => { setMode(null); setSelectedRdv(null); }} 
                />
            )}

            <div className="patients-stats-grid">
                <RendezvousCard title="TOTAL RDV" value={totalCount} />
                <RendezvousCard title="CONFIRMÉS" value={confirmedCount} />
                <RendezvousCard title="EN ATTENTE" value={pendingCount} />
                <RendezvousCard title="ANNULÉS" value={cancelledCount} />
            </div>

            <div className="search-filter-bar">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Filtrer par ID patient ou médecin..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="status-filter-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'Tous', value: 'ALL' },
                    { label: 'Confirmés', value: 'CONFIRMED' },
                    { label: 'En attente', value: 'PENDING' },
                    { label: 'Annulés', value: 'CANCELLED' }
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setSelectedStatus(tab.value)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: '1px solid #cbd5e1',
                            background: selectedStatus === tab.value ? '#0284c7' : '#ffffff',
                            color: selectedStatus === tab.value ? '#ffffff' : '#334155',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {medecinLoading || loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chargement des rendez-vous...</div>
            ) : (
                <RendezvousTable 
                    rendezvous={filteredRendezvous} 
                    userRole={userRole}
                    onView={handleViewClick}
                    onEdit={(isAdmin || isMedecin) ? handleEditClick : null}
                    onDelete={isAdmin ? handleDeleteRendezvous : null}
                />
            )}
        </div>
    )
}