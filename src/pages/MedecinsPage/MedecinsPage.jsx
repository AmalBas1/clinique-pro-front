import { useState, useEffect } from 'react'
import { Stethoscope, Award, Search, UserPlus } from 'lucide-react'
import MedecinCard from '../../components/medecins/MedecinCard/MedecinCard'
import MedecinTable from '../../components/medecins/MedecinTable/MedecinTable'
import MedecinForm from '../../components/medecins/MedecinForm/MedecinForm'

export default function MedecinsPage() {
    const [medecins, setMedecins] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [mode, setMode] = useState(null) 
    const [selectedMedecin, setSelectedMedecin] = useState(null)

    const userRole = localStorage.getItem('role') || JSON.parse(localStorage.getItem('user') || '{}')?.role || ''
    const isAdmin = userRole.includes('ADMIN') || userRole.includes('Admin')

    const getTokenHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('accessToken')
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    const fetchMedecins = () => {
        setLoading(true)
        fetch('/api/medecins', { headers: getTokenHeaders() })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const list = data.content || data
                setMedecins(list)
            })
            .catch(err => console.error("Erreur chargement médecins:", err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchMedecins()
    }, [])

    const handleSaveMedecin = (formData) => {
        const url = mode === 'edit' ? `/api/medecins/${selectedMedecin.id}` : '/api/medecins'
        const method = mode === 'edit' ? 'PUT' : 'POST'

        fetch(url, {
            method: method,
            headers: getTokenHeaders(),
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (res.ok) {
                setMode(null)
                setSelectedMedecin(null)
                fetchMedecins()
            } else {
                alert("Erreur lors de l'enregistrement.")
            }
        })
        .catch(err => console.error("Erreur:", err))
    }

    const handleToggleDispo = (medecin) => {
        fetch(`/api/medecins/${medecin.id}/indisponible`, {
            method: 'PUT',
            headers: getTokenHeaders()
        })
        .then(res => {
            if (res.ok) {
                fetchMedecins();
            } else {
                alert("Erreur lors de la mise à jour du statut.");
            }
        })
        .catch(err => console.error("Erreur:", err));
    }

 const handleDeleteMedecin = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce médecin ?")) {
        fetch(`/api/medecins/${id}`, {
            method: 'DELETE',
            headers: getTokenHeaders()
        })
        .then(res => {
            if (res.ok) {
                setMedecins(prevMedecins => prevMedecins.filter(m => m.id !== id))
            } else {
                alert("Suppression impossible.")
            }
        })
        .catch(err => console.error("Erreur suppression:", err))
    }
}

    const handleViewClick = (medecin) => {
        setSelectedMedecin(medecin)
        setMode('view')
    }

    const handleEditClick = (medecin) => {
        setSelectedMedecin(medecin)
        setMode('edit')
    }

    const filteredMedecins = medecins.filter(m => 
        (m.nom && m.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.prenom && m.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.specialite && m.specialite.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="patients-page">
            <header className="patients-header-section">
                <div>
                    <span className="module-subtitle">RH & ORGANISATION • {medecins.length} praticiens enregistrés</span>
                    <h1>Gestion des Médecins</h1>
                    <p>Consultation du corps médical et des spécialités.</p>
                </div>
                {isAdmin && (
                    <button className="btn-add-patient" onClick={() => { 
                        setSelectedMedecin(null); 
                        setMode(mode === 'add' ? null : 'add'); 
                    }}>
                        <UserPlus size={18} />
                        <span>{mode === 'add' ? "Fermer le formulaire" : "+ Nouveau Médecin"}</span>
                    </button>
                )}
            </header>

            {mode && (
                <MedecinForm 
                    medecinToEdit={selectedMedecin} 
                    mode={mode}
                    onSubmit={handleSaveMedecin} 
                    onCancel={() => { setMode(null); setSelectedMedecin(null); }} 
                />
            )}

            <div className="patients-stats-grid">
                <MedecinCard title="MEDECINS ACTIFS" value={medecins.length} icon={Stethoscope} />
                <MedecinCard title="SPÉCIALITÉS" value={new Set(medecins.map(m => m.specialite)).size} icon={Award} />
            </div>

            <div className="search-filter-bar">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom de médecin ou spécialité..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <MedecinTable 
                medecins={filteredMedecins} 
                onView={handleViewClick}
                onEdit={isAdmin ? handleEditClick : null}
                onDelete={isAdmin ? handleDeleteMedecin : null}
                onToggleDispo={handleToggleDispo}
            />
        </div>
    )
}