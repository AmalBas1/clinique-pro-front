import { useState } from 'react'

export default function RendezvousForm({ rdvToEdit, mode, userRole = '', currentPatientId = '', currentMedecinId = '', onSubmit, onCancel }) {
    const isPatient = userRole.toUpperCase().includes('PATIENT')
    const isMedecin = userRole.toUpperCase().includes('MEDECIN')
    const isAdmin = userRole.toUpperCase().includes('ADMIN')

    const [formData, setFormData] = useState({
        patientId: rdvToEdit?.patientId || rdvToEdit?.patient?.id || (isPatient ? currentPatientId : ''),
        medecinId: rdvToEdit?.medecinId || rdvToEdit?.medecin?.id || (isMedecin ? currentMedecinId : ''),
        dateRendezVous: rdvToEdit?.dateRendezVous || '',
        statut: rdvToEdit?.statut || 'PENDING'
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const isViewMode = mode === 'view'
    const canEditStatus = (isAdmin || isMedecin) && mode === 'edit'

    return (
        <form onSubmit={handleSubmit} className="rendezvous-form" style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <h3>{mode === 'edit' ? 'Modifier le Rendez-vous' : mode === 'view' ? 'Détails du Rendez-vous' : 'Nouveau Rendez-vous'}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>ID Patient :</label>
                    <input 
                        type="text" 
                        name="patientId"
                        value={formData.patientId} 
                        onChange={handleChange}
                        disabled={isViewMode || isPatient} 
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: (isViewMode || isPatient) ? '#f1f5f9' : '#fff' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>ID Médecin :</label>
                    <input 
                        type="text" 
                        name="medecinId"
                        value={formData.medecinId} 
                        onChange={handleChange}
                        disabled={isViewMode || isMedecin} 
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: (isViewMode || isMedecin) ? '#f1f5f9' : '#fff' }}
                    />
                    {isMedecin && <small style={{ color: '#64748b' }}>Votre ID de médecin est automatiquement assigné.</small>}
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Date et Heure :</label>
                    <input 
                        type="datetime-local" 
                        name="dateRendezVous"
                        value={formData.dateRendezVous} 
                        onChange={handleChange}
                        disabled={isViewMode} 
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: isViewMode ? '#f1f5f9' : '#fff' }}
                    />
                </div>

                {(isViewMode || mode === 'edit') && (
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Statut :</label>
                        <select
                            name="statut"
                            value={formData.statut}
                            onChange={handleChange}
                            disabled={isViewMode}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: isViewMode ? '#f1f5f9' : '#fff' }}
                        >
                            <option value="PENDING">En attente</option>
                            <option value="CONFIRMED">Confirmé</option>
                            <option value="CANCELLED">Annulé</option>
                        </select>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {!isViewMode && (
                        <button type="submit" style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Enregistrer
                        </button>
                    )}
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {isViewMode ? 'Fermer' : 'Annuler'}
                    </button>
                </div>
            </div>
        </form>
    )
}