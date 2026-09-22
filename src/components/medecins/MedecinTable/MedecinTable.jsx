import { Eye, Pencil, Trash2, Stethoscope } from 'lucide-react'

export default function MedecinTable({ medecins, onView, onEdit, onDelete }) {
    return (
        <div className="table-container">
            <table className="patients-table">
                <thead>
                    <tr>
                        <th>MÉDECIN</th>
                        <th>SPÉCIALITÉ</th>
                        <th>CONTACT DU MÉDECIN</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {medecins.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="no-data">Aucun médecin répertorié.</td>
                        </tr>
                    ) : (
                        medecins.map((medecin) => (
                            <tr key={medecin.id}>
                                <td>
                                    <div className="patient-name-cell">
                                        <strong>Dr. {medecin.prenom} {medecin.nom}</strong>
                                    </div>
                                </td>

                                <td>
                                    <span className="rdv-date">
                                        <Stethoscope size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                        {medecin.specialite || 'Médecine Générale'}
                                    </span>
                                </td>

                                <td>
                                    <div className="patient-contact-cell">
                                            <span>
                                                {medecin.disponible ? '🟢 Disponible' : '🔴 Indisponible'}
                                            
                                            </span>                       
                                 <span>📞 {medecin.telephone || 'Non renseigné'}</span>
                                    </div>
                                </td>

                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => onView(medecin)} title="Voir" className="btn-action view">
                                            <Eye size={16} />
                                        </button>
                                        
                                        {onEdit && (
                                            <button onClick={() => onEdit(medecin)} title="Modifier" className="btn-action edit">
                                                <Pencil size={16} />
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button onClick={() => onDelete(medecin.id)} title="Supprimer" className="btn-action delete">
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