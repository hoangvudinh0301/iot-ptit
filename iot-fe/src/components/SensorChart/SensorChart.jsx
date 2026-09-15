import { useState } from "react";
import "./SensorChart.css";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import { useEffect } from "react";
// const data = [
//     { time: "0", temperature: 220, humidity: 100, light: 160 },
//     { time: "1", temperature: 250, humidity: 230, light: 260 },
//     { time: "2", temperature: 20, humidity: 80, light: 90 },
//     { time: "4", temperature: 240, humidity: 45, light: 40 },
//     { time: "3", temperature: 230, humidity: 30, light: 140 },
//     { time: "4", temperature: 40, humidity: 60, light: 72 },
//     { time: "4", temperature: 50, humidity: 23, light: 34 },
//     { time: "4", temperature: 150, humidity: 56, light: 40 },
//     { time: "4", temperature: 89, humidity: 76, light: 33}
// ];
function SensorChart() {

    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/sensor-data/chart`)
            .then((response) => response.json())
            .then((data) => {

                const grouped = {};
                data.forEach((item) => {
                    const time = item.createdAt;
                    if (!grouped[time]) {
                        grouped[time] = {time};
                    }
                    if (item.sensor.id === 1) {
                        grouped[time].temperature = item.value;
                    }
                    if (item.sensor.id === 2) {
                        grouped[time].light = item.value;
                    }
                    if (item.sensor.id === 3) {
                        grouped[time].humidity = item.value;
                    }
                });
                const formattedData = Object.values(grouped).map((item) => ({
                    ...item,
                    time: new Date(item.time).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }));
                setSensorData(formattedData);
                console.log(formattedData);
            })
            .catch((error) => {
                console.error("Lỗi: ", error);
            });
    }, []);

    return (
        <div className="chart-container">
            <h3>Biểu đồ</h3>
            <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorData} margin={{top: 5, right: 5, left: 0, bottom: 5}}>
                        <CartesianGrid strokeDasharray="0" stroke="#e5e5e5"/>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }}/>
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
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