import SensorCard from "../../components/SensorCard/SensorCard";
import SensorChart from "../../components/SensorChart/SensorChart";
import DevicePanel from "../../components/DevicePanel/DevicePanel";
import "./Dashboard.css";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

function Dashboard() {
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        light: 0
    });

    useEffect(() => {
        let active = true;
        let initialized = false;
        const pending = [];
        const updateSensorData = (data) => {
            if (!active) return;
            setSensorData(prev => ({
                ...prev,
                ...(data.temperature != null && {
                    temperature: data.temperature
                }),
                ...(data.humidity != null && {
                    humidity: data.humidity
                }),
                ...(data.light != null && {
                    light: data.light
                })
            }));
        };
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            reconnectDelay: 5000,
            onConnect: async () => {
                client.subscribe("/topic/sensors", message => {
                    const data = JSON.parse(message.body);

                    if (!initialized) {
                        pending.push(data);
                    } else {
                        updateSensorData(data);
                    }
                });
                if (!initialized) {
                    try {
                        const response = await fetch(
                            "http://localhost:8080/api/sensor-data/latest"
                        );
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        const data = await response.json();
                        updateSensorData(data);
                    } catch (error) {
                        console.error(
                            "Cannot get latest sensor data:",
                            error
                        );
                    } finally {
                        initialized = true;
                        pending.splice(0).forEach(updateSensorData);
                    }
                }
            },
            onStompError: frame => {
                console.error("STOMP error:", frame);
            },
            onWebSocketError: error => {
                console.error("WebSocket error:", error);
            }
        });

        client.activate();
        return () => {
            active = false;
            client.deactivate();
        };
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