import { useState } from "react";
import "./SensorChart.css";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
function SensorChart() {
    const [sensorData, setSensorData] = useState([]);
    useEffect(() => {
        let active = true;
        let subscription;
        let initialized = false;
        const pending = [];
        const formatTime = (timestamp) =>
            new Date(timestamp).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            });
        const appendPoint = (point) => {
            if (!active) return;
            setSensorData((prev) => {
                const exists = prev.some(
                    (item) => item.timestamp === point.createdAt
                );
                if (exists) return prev;
                return [...prev, {
                    timestamp: point.createdAt,
                    time: formatTime(point.createdAt),
                    temperature: point.temperature,
                    humidity: point.humidity,
                    light: point.light
                }]
                    .sort((a, b) =>
                        new Date(a.timestamp) -
                        new Date(b.timestamp)
                    )
                    .slice(-30);
            });
        };
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            reconnectDelay: 5000,
            onConnect: async () => {
                subscription = client.subscribe(
                    "/topic/sensors",
                    (message) => {
                        const point = JSON.parse(message.body);
                        if (!initialized) {
                            pending.push(point);
                        } else {
                            appendPoint(point);
                        }
                    }
                );
                if (!initialized) {
                    try {
                        const response = await fetch(
                            "http://localhost:8080/api/sensor-data/latest-30"
                        );
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        const records = await response.json();
                        const grouped = {};
                        records.forEach((item) => {
                            const timestamp = item.createdAt;
                            if (!grouped[timestamp]) {
                                grouped[timestamp] = {
                                    timestamp,
                                    time: formatTime(timestamp)
                                };
                            }
                            if (item.sensor.id === 1) {
                                grouped[timestamp].temperature = item.value;
                            } else if (item.sensor.id === 2) {
                                grouped[timestamp].humidity = item.value;
                            } else if (item.sensor.id === 3) {
                                grouped[timestamp].light = item.value;
                            }
                        });
                        const initial = Object.values(grouped)
                            .sort((a, b) =>
                                new Date(a.timestamp) -
                                new Date(b.timestamp)
                            )
                            .slice(-10);
                        if (active) {
                            setSensorData(initial);
                        }
                    } catch (error) {
                        console.error("Lỗi tải dữ liệu:", error);
                    } finally {
                        initialized = true;
                        pending.splice(0).forEach(appendPoint);
                    }
                }
            }
        });
        client.activate();
        return () => {
            active = false;
            subscription?.unsubscribe();
            client.deactivate();
        };
    }, []);

    return (
        <div className="chart-container">
            <h3>Biểu đồ</h3>
            <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorData.slice(-10)} margin={{top: 5, right: 10, left: 0, bottom: 10}}>
                        <CartesianGrid strokeDasharray="0" stroke="#e5e5e5"/>
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={65}
                            interval={0}
                            minTickGap={5}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip labelFormatter={(time) => `Thời gian: ${time}`}/>
                        <Legend wrapperStyle={{fontSize: "10px", paddingBottom: "5px"}} />

                        <Line
                            type="monotone"
                            dataKey="temperature"
                            name="Nhiệt độ (°C)"
                            stroke="#ff7a00"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="humidity"
                            name="Độ ẩm (%)"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="light"
                            name="Ánh sáng (Lux)"
                            stroke="#f5c400"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
export default SensorChart;