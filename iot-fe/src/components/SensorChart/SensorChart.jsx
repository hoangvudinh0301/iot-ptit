import "./SensorChart.css";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

const data = [
    { time: "0", temperature: 220, humidity: 100, light: 160 },
    { time: "1", temperature: 250, humidity: 230, light: 260 },
    { time: "2", temperature: 20, humidity: 80, light: 90 },
    { time: "4", temperature: 240, humidity: 45, light: 40 },
    { time: "3", temperature: 230, humidity: 30, light: 140 },
    { time: "4", temperature: 40, humidity: 60, light: 72 },
    { time: "4", temperature: 50, humidity: 23, light: 34 },
    { time: "4", temperature: 150, humidity: 56, light: 40 },
    { time: "4", temperature: 89, humidity: 76, light: 33}
];
function SensorChart() {
    return (
        <div className="chart-container">
            <h3>Biểu đồ</h3>
            <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{top: 5, right: 5, left: 0, bottom: 5}}>
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