
export default function MedecinCard({ title, value, icon: Icon }) {
    return (
        <div className="patient-card">
            <h4>{title}</h4>
            <div className="patient-card-content">
                {Icon && <Icon className="card-icon" />}
                <span className="card-value">{value}</span>
            </div>
        </div>
    )
}