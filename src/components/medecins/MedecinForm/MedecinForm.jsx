import { useState, useEffect } from 'react'

export default function MedecinForm({ medecinToEdit, mode, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        specialite: '',
        disponible: false
    })

    const isView = mode === 'view'

    useEffect(() => {
        if (medecinToEdit) {
            setFormData({
                nom: medecinToEdit.nom || '',
                prenom: medecinToEdit.prenom || '',
                telephone: medecinToEdit.telephone || '',
                specialite: medecinToEdit.specialite || '',
                userId: medecinToEdit.userId || '',
                disponible: medecinToEdit.disponible ?? false
            })
        }
    }, [medecinToEdit])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isView) {
            onSubmit({
                ...formData,
                userId: formData.userId ? Number(formData.userId) : null
            })
        }
    }

    return (
        <div className="patient-form-container">
            <h3>
                {mode === 'view' && "Détails du Médecin"}
                {mode === 'edit' && "Modifier le Médecin"}
                {mode === 'add' && "Ajouter un Nouveau Médecin"}
            </h3>
            <form onSubmit={handleSubmit} className="patient-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Nom</label>
                        <input 
                            type="text" 
                            value={formData.nom} 
                            disabled={isView}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Prénom</label>
                        <input 
                            type="text" 
                            value={formData.prenom} 
                            disabled={isView}
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Spécialité</label>
                        <input 
                            type="text" 
                            value={formData.specialite} 
                            disabled={isView}
                            onChange={(e) => setFormData({...formData, specialite: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Téléphone</label>
                        <input 
                            type="text" 
                            value={formData.telephone} 
                            disabled={isView}
                            onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
                        />
                    </div>
                </div>

                {!isView && (
                    <div className="form-row">
                    
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={formData.disponible} 
                                    onChange={(e) => setFormData({...formData, disponible: e.target.checked})} 
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <strong>Disponible</strong>
                            </label>
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        {isView ? "Fermer" : "Annuler"}
                    </button>
                    {!isView && (
                        <button type="submit" className="btn-save">
                            {mode === 'edit' ? "Modifier" : "Enregistrer"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}