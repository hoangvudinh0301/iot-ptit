import SensorCard from "../../components/SensorCard/SensorCard";
import SensorChart from "../../components/SensorChart/SensorChart";
import DevicePanel from "../../components/DevicePanel/DevicePanel";
import "./Dashboard.css"
import { useEffect } from "react";
import { useState } from "react";
function Dashboard() {
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        light: 0
    });
    useEffect(() => {
        fetch(`http://localhost:8080/api/sensor-data/latest`)
            .then(res => res.json())
            .then(data => {
                setSensorData(data);
                console.log(data);
            })
            .catch(err => {console.error("Cannot get latest sensor data:")});
    }, []);
    return (
        <div className="dashboard">
            <div className="sensor-cards">
                <SensorCard
                    title="Nhiệt độ"
                    value={`${sensorData.temperature}°C`}
                    type="temperature"
                />
                <SensorCard
                    title="Độ ẩm"
                    value={`${sensorData.humidity}%`}
                    type="humidity"
                />
                <SensorCard
                    title="Ánh sáng"
                    value={`${sensorData.light} Lux`}
                    type="light"
                />
            </div>
            <div className="dashboard-bottom">
                <SensorChart />
                <DevicePanel />
            </div>
        </div>
    );
}

export default Dashboard;