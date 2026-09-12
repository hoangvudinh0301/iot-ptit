import SensorCard from "../../components/SensorCard/SensorCard";
import SensorChart from "../../components/SensorChart/SensorChart";
import DevicePanel from "../../components/DevicePanel/DevicePanel";
import "./Dashboard.css"

function Dashboard() {
    return (
        <div className="dashboard-content">
            <div className="sensor-cards">
                <SensorCard
                    title="Nhiệt độ"
                    value="30.8°C"
                    type="temperature"
                />
                <SensorCard
                    title="Độ ẩm"
                    value="50.6%"
                    type="humidity"
                />
                <SensorCard
                    title="Ánh sáng"
                    value="243.2 Lux"
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