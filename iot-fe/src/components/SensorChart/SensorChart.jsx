
import { useState, useEffect } from "react";
import "./SensorChart.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import { Client } from "@stomp/stompjs";
import { apiFetch } from "../../services/api";

// Cache dữ liệu khi chuyển trang
let chartCache = [];

const MAX_POINTS = 10;

// Định dạng thời gian
const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
};

// Chuẩn hóa dữ liệu WebSocket
const normalizePoint = (point) => {
    const timestamp = point.createdAt ?? point.timestamp;

    return {
        timestamp,
        time: formatTime(timestamp),
        temperature: point.temperature,
        humidity: point.humidity,
        light: point.light
    };
};

// Gộp dữ liệu, loại bỏ timestamp trùng
const mergePoints = (current, incoming) => {
    const map = new Map(
        current.map(point => [point.timestamp, point])
    );

    incoming.forEach(point => {
        if (!point.timestamp) return;

        const old = map.get(point.timestamp) ?? {};

        map.set(point.timestamp, {
            ...old,
            ...Object.fromEntries(
                Object.entries(point).filter(
                    ([, value]) => value !== undefined
                )
            )
        });
    });

    return [...map.values()]
        .sort(
            (a, b) =>
                new Date(a.timestamp) - new Date(b.timestamp)
        )
        .slice(-MAX_POINTS);
};

function SensorChart() {
    const [sensorData, setSensorData] = useState(chartCache);

    useEffect(() => {
        let active = true;
        let initialLoaded = false;

        const pending = [];

        const updateChart = (points) => {
            if (!active) return;

            setSensorData(prev => {
                const updated = mergePoints(prev, points);
                chartCache = updated;
                return updated;
            });
        };

        // 1. Lấy dữ liệu ban đầu từ Backend
        const loadInitialData = async () => {
            try {
                const records = await apiFetch(
                    "/api/sensor-data/latest-30"
                );

                const grouped = {};

                records.forEach(item => {
                    const timestamp = item.createdAt;

                    if (!grouped[timestamp]) {
                        grouped[timestamp] = {
                            timestamp,
                            time: formatTime(timestamp)
                        };
                    }

                    const sensorId = Number(item.sensor?.id);

                    if (sensorId === 1) {
                        grouped[timestamp].temperature = item.value;

                    } else if (sensorId === 2) {
                        grouped[timestamp].humidity = item.value;

                    } else if (sensorId === 3) {
                        grouped[timestamp].light = item.value;
                    }
                });

                const initial = Object.values(grouped)
                    .sort(
                        (a, b) =>
                            new Date(a.timestamp) -
                            new Date(b.timestamp)
                    )
                    .slice(-MAX_POINTS);

                if (active) {
                    updateChart(initial);
                }

            } catch (error) {
                console.error(
                    "Lỗi tải dữ liệu biểu đồ:",
                    error
                );

            } finally {
                initialLoaded = true;

                if (active) {
                    updateChart(pending.splice(0));
                }
            }
        };

        loadInitialData();

        // 2. WebSocket cập nhật realtime
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",

            connectHeaders: {
                Authorization:
                    `Bearer ${sessionStorage.getItem("accessToken")}`
            },

            reconnectDelay: 5000,

            onConnect: () => {
                console.log("WebSocket connected");

                client.subscribe(
                    "/topic/sensors",
                    (message) => {
                        try {
                            const point = normalizePoint(
                                JSON.parse(message.body)
                            );

                            if (!initialLoaded) {
                                pending.push(point);
                            } else {
                                updateChart([point]);
                            }

                        } catch (error) {
                            console.error(
                                "Invalid sensor data:",
                                error
                            );
                        }
                    }
                );
            },

            onWebSocketError: (error) => {
                console.error("WebSocket error:", error);
            },

            onStompError: (frame) => {
                console.error("STOMP error:", frame);
            }
        });

        client.activate();

        return () => {
            active = false;
            client.deactivate();
        };
    }, []);

    return (
        <div className="chart-container">
            <h3>Biểu đồ</h3>

            <div className="chart">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart
                        data={sensorData}
                        margin={{
                            top: 10,
                            right: 5,
                            left: 0,
                            bottom: 10
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e5e5"
                        />

                        {/* Trục thời gian */}
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={65}
                            interval={0}
                            minTickGap={5}
                        />

                        {/* Trục Y trái: Nhiệt độ, độ ẩm */}
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tick={{ fontSize: 10 }}
                            domain={[0, "auto"]}
                            width={40}
                        />

                        {/* Trục Y phải: Ánh sáng */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{
                                fontSize: 10,
                                fill: "#f5c400"
                            }}
                            axisLine={{
                                stroke: "#f5c400"
                            }}
                            tickLine={{
                                stroke: "#f5c400"
                            }}
                            domain={[0, "auto"]}
                            width={45}
                            allowDecimals={false}
                        />

                        <Tooltip
                            labelFormatter={(time) =>
                                `Thời gian: ${time}`
                            }
                        />

                        <Legend
                            wrapperStyle={{
                                fontSize: "10px",
                                paddingBottom: "5px"
                            }}
                        />

                        {/* Nhiệt độ - trục trái */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            name="Nhiệt độ (°C)"
                            stroke="#ff7a00"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                            isAnimationActive={false}
                            connectNulls
                        />

                        {/* Độ ẩm - trục trái */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="humidity"
                            name="Độ ẩm (%)"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                            isAnimationActive={false}
                            connectNulls
                        />

                        {/* Ánh sáng - trục phải */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="light"
                            name="Ánh sáng (Lux)"
                            stroke="#f5c400"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 4 }}
                            isAnimationActive={false}
                            connectNulls
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SensorChart;
