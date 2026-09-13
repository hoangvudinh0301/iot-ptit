import "./SensorCard.css"

function SensorCard({title, value, type}) {
    return (
        <div className={`sensor-card ${type}`}>
            <h3>{title}</h3>
            <div className="sensor-value">
                {value}
            </div>
        </div>
    )
}
export default SensorCard