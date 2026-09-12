import Pagination from "../Pagination/Pagination";
import "./SensorTable.css"


const sensors = [
    {
        id: 1,
        temperature: "30°C",
        humidity: "50 %",
        light: "200 Lux",
        time: "11:00 13/08/2026"
    },
    {
        id: 2,
        temperature: "29°C",
        humidity: "60 %",
        light: "250 Lux",
        time: "10:00 13/08/2026"
    },
    {
        id: 3,
        temperature: "30°C",
        humidity: "70 %",
        light: "230 Lux",
        time: "09:00 13/08/2026"
    },
    {
        id: 3,
        temperature: "30°C",
        humidity: "70 %",
        light: "230 Lux",
        time: "09:00 13/08/2026"
    },
    {
        id: 3,
        temperature: "30°C",
        humidity: "70 %",
        light: "230 Lux",
        time: "09:00 13/08/2026"
    },
    {
        id: 3,
        temperature: "30°C",
        humidity: "70 %",
        light: "230 Lux",
        time: "09:00 13/08/2026"
    },
    {
        id: 3,
        temperature: "30°C",
        humidity: "70 %",
        light: "230 Lux",
        time: "09:00 13/08/2026"
    },
    {
        id: 4,
        temperature: "30°C",
        humidity: "70 %",
        light: "230 Lux",
        time: "09:00 13/08/2026"
    }
];
function SensorTable() {
    return (
        <div className="sensor-table-wrapper">
            <table className="sensor-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nhiệt độ</th>
                        <th>Độ ẩm</th>
                        <th>Ánh sáng</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {sensors.map((sensor) => (
                        <tr key={sensor.id}>
                            <td>{sensor.id}</td>
                            <td className="temperature">{sensor.temperature}</td>
                            <td className="humidity">{sensor.humidity}</td>
                            <td className="light">{sensor.light}</td>
                            <td className="time">{sensor.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination />
        </div>
    )
}
export default SensorTable