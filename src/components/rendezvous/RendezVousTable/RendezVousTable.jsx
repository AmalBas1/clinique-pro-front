import { Eye, Edit, Trash2, Clock } from 'lucide-react'
import './RendezVousTable.css'

export default function RendezvousTable({ rendezvous, userRole = '', onView, onEdit, onDelete }) {
    
    const role = userRole ? userRole.toUpperCase() : '';
    const isAdmin = role.includes('ADMIN');
    const isMedecin = role.includes('MEDECIN');

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'CONFIRMED':
                return <span className="status-badge confirmed"><span className="dot"></span> Confirmé</span>;
            case 'PENDING':
                return <span className="status-badge pending"><span className="dot"></span> En attente</span>;
            case 'CANCELLED':
                return <span className="status-badge cancelled"><span className="dot"></span> Annulé</span>;
            default:
                return <span className="status-badge">{statut}</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="patient-table-container">
            <table className="patient-table">
                <thead>
                    <tr>
                        <th>PATIENT ID</th>
                        <th>MÉDECIN ID</th>
                        <th>DATE & HEURE</th>
                        <th>STATUT</th>
                        <th className="actions-header">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {rendezvous.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-data">Aucun rendez-vous trouvé.</td>
                        </tr>
                    ) : (
                        rendezvous.map((rdv) => (
                            <tr key={rdv.id}>
                                <td>Patient #{rdv.patientId}</td>
                                <td>Médecin #{rdv.medecinId}</td>
                                <td>
                                    <div className="rdv-date">
                                        <Clock size={14} style={{ marginRight: '6px' }} />
                                        {formatDate(rdv.dateRendezVous)}
                                    </div>
                                </td>
                                <td>{getStatusBadge(rdv.statut)}</td>
                                <td className="actions-cell">
                                    <button title="Voir" className="btn-icon view" onClick={() => onView(rdv)}>
                                        <Eye size={16} />
                                    </button>

                                    {(isAdmin || isMedecin) && onEdit && (
                                        <button title="Modifier" className="btn-icon edit" onClick={() => onEdit(rdv)}>
                                            <Edit size={16} />
                                        </button>
                                    )}

                                    {isAdmin && onDelete && (
                                        <button title="Supprimer" className="btn-icon delete" onClick={() => onDelete(rdv.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}