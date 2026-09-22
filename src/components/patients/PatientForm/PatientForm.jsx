import { useState, useEffect } from 'react'
import './PatientForm.css'

export default function PatientForm({ patientToEdit, mode, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        dateNaissance: ''
    })

    const isView = mode === 'view'

    useEffect(() => {
        if (patientToEdit) {
            setFormData({
                nom: patientToEdit.nom || '',
                prenom: patientToEdit.prenom || '',
                telephone: patientToEdit.telephone || '',
                adresse: patientToEdit.adresse || '',
                dateNaissance: patientToEdit.dateNaissance || ''
            })
        }
    }, [patientToEdit])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isView) {
            onSubmit(formData)
        }
    }

    return (
        <div className="patient-form-container">
            <h3>
                {mode === 'view' && "Détails du Patient"}
                {mode === 'edit' && "Modifier le Patient"}
                {mode === 'add' && "Ajouter un Nouveau Patient"}
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
                        <label>Téléphone</label>
                        <input 
                            type="text" 
                            value={formData.telephone} 
                            disabled={isView}
                            onChange={(e) => setFormData({...formData, telephone: e.target.value})} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Date de naissance</label>
                        <input 
                            type="date" 
                            value={formData.dateNaissance} 
                            disabled={isView}
                            onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})} 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Adresse</label>
                    <input 
                        type="text" 
                        value={formData.adresse} 
                        disabled={isView}
                        onChange={(e) => setFormData({...formData, adresse: e.target.value})} 
                    />
                </div>

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