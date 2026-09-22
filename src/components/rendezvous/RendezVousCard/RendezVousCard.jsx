import './RendezVousCard.css'
export default function RendezvousCard({ title, value}) {
    return (
        <div className="patient-card">
            <div className="patient-card-content">
                <span className="patient-card-title">{title}</span>
                <span className="patient-card-value">{value}</span>
            </div>
        </div>
    )
}