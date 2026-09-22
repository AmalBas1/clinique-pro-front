import { useState, useEffect } from 'react'
import { Users, Calendar, Search, UserPlus } from 'lucide-react'
import PatientCard from '../../components/patients/PatientCard/PatientCard'
import PatientTable from '../../components/patients/PatientTable/PatientTable'
import PatientForm from '../../components/patients/PatientForm/PatientForm'
import './PatientsPage.css'

export default function PatientsPage() {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [mode, setMode] = useState(null) 
    const [selectedPatient, setSelectedPatient] = useState(null)

    const userRole = localStorage.getItem('role') || JSON.parse(localStorage.getItem('user') || '{}')?.role || ''
    const isAdmin = userRole.includes('ADMIN') || userRole.includes('Admin')
    const isMedecin = userRole.includes('MEDECIN') || userRole.includes('Medecin')

    const getTokenHeaders = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('accessToken')
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    const fetchPatients = () => {
        setLoading(true)
        fetch('/api/patients', { headers: getTokenHeaders() })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const list = data.content || data
                setPatients(list)
            })
            .catch(err => console.error("Erreur chargement patients:", err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchPatients()
    }, [])

    const handleSavePatient = (formData) => {
        const url = mode === 'edit' ? `/api/patients/${selectedPatient.id}` : '/api/patients'
        const method = mode === 'edit' ? 'PUT' : 'POST'

        fetch(url, {
            method: method,
            headers: getTokenHeaders(),
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (res.ok) {
                setMode(null)
                setSelectedPatient(null)
                fetchPatients()
            } else {
                alert("Erreur lors de l'enregistrement.")
            }
        })
        .catch(err => console.error("Erreur:", err))
    }

    const handleDeletePatient = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce patient ?")) {
            fetch(`/api/patients/${id}`, {
                method: 'DELETE',
                headers: getTokenHeaders()
            })
            .then(res => {
                if (res.ok) {
                    setPatients(prevPatients => prevPatients.filter(p => p.id !== id))
                } else {
                    alert("Suppression impossible.")
                }
            })
            .catch(err => console.error("Erreur suppression:", err))
        }
    }

    const handleViewClick = (patient) => {
        setSelectedPatient(patient)
        setMode('view')
    }

    const handleEditClick = (patient) => {
        setSelectedPatient(patient)
        setMode('edit')
    }

    const filteredPatients = patients.filter(p => 
        (p.nom && p.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.prenom && p.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.telephone && p.telephone.includes(searchTerm))
    )

    const totalRdv = patients.filter(p => p.prochainRdv || p.dernierRdv).length

    return (
        <div className="patients-page">
            <header className="patients-header-section">
                <div>
                    <span className="module-subtitle">MODULE CLINIQUE • {patients.length} dossiers répertoriés</span>
                    <h1>Gestion des Patients</h1>
                    <p>Consultez, ajoutez et mettez à jour les fiches médicales et antécédents cliniques en toute conformité.</p>
                </div>
                
                {isAdmin && (
                    <button className="btn-add-patient" onClick={() => { 
                        setSelectedPatient(null); 
                        setMode(mode === 'add' ? null : 'add'); 
                    }}>
                        <UserPlus size={18} />
                        <span>{mode === 'add' ? "Fermer le formulaire" : "+ Nouveau Patient"}</span>
                    </button>
                )}
            </header>

            {mode && (
                <PatientForm 
                    patientToEdit={selectedPatient} 
                    mode={mode}
                    onSubmit={handleSavePatient} 
                    onCancel={() => { setMode(null); setSelectedPatient(null); }} 
                />
            )}

            <div className="patients-stats-grid">
                <PatientCard title="PATIENTS SUIVIS" value={patients.length} icon={Users} />
                <PatientCard title="CONSULTATIONS / RDV" value={totalRdv} icon={Calendar} />
            </div>

            <div className="search-filter-bar">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom ou téléphone..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <PatientTable 
                patients={filteredPatients} 
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={isAdmin ? handleDeletePatient : null}
            />
        </div>
    )
}