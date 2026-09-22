import { Eye, Pencil, Trash2, Stethoscope } from 'lucide-react'
import './PatientTable.css'

export default function PatientTable({ patients, onView, onEdit, onDelete }) {
    return (
        <div className="table-container">
            <table className="patients-table">
                <thead>
                    <tr>
                        <th>PATIENT</th>
                        <th>CONTACT</th>
                        <th>DERNIER / PROCHAIN RDV</th>
                        <th>MÉDECIN RÉFÉRENT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-data">Aucun patient répertorié.</td>
                        </tr>
                    ) : (
                        patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>
                                    <div className="patient-name-cell">
                                        <strong>{patient.prenom} {patient.nom}</strong>
                                        <span>Né(e) {patient.dateNaissance || 'N/A'}</span>
                                    </div>
                                </td>

                                <td>
                                    <div className="patient-contact-cell">
                                        <span>📞 {patient.telephone || 'Non renseigné'}</span>
                                        <span>✉️ {patient.adresse || patient.user?.username || 'N/A'}</span>
                                    </div>
                                </td>

                                <td>
                                    <span className="rdv-date">
                                        {patient.prochainRdv || patient.dernierRdv || 'Aucun RDV'}
                                    </span>
                                </td>

                                <td>
                                    <div className="medecin-cell">
                                        <Stethoscope size={14} />
                                        <span>
                                            {patient.medecin ? `Dr. ${patient.medecin.nom}` : (patient.medecinNom || 'Non assigné')}
                                        </span>
                                    </div>
                                </td>

                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => onView(patient)} title="Voir" className="btn-action view">
                                            <Eye size={16} />
                                        </button>
                                        
                                        {onEdit && (
                                            <button onClick={() => onEdit(patient)} title="Modifier" className="btn-action edit">
                                                <Pencil size={16} />
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button onClick={() => onDelete(patient.id)} title="Supprimer" className="btn-action delete">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}