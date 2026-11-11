
import { useCallback, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import { apiFetch } from "../../services/api";
import "./BlinkStatistics.css";

const LED_INFO = [
  {
    id: 1,
    name: "Đèn 1",
    sensor: "Nhiệt độ",
    description: "Nhấp nháy khi nhiệt độ vượt ngưỡng",
    color: "#ef4444",
  },
  {
    id: 2,
    name: "Đèn 2",
    sensor: "Độ ẩm",
    description: "Nhấp nháy khi độ ẩm vượt ngưỡng",
    color: "#2367EE",
  },
  {
    id: 3,
    name: "Đèn 3",
    sensor: "Ánh sáng",
    description: "Nhấp nháy khi ánh sáng vượt ngưỡng",
    color: "#f59e0b",
  },
];

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("vi-VN");
}

export default function BlinkStatistics() {
  const [stats, setStats] = useState({
    total: 0,
    devices: [],
    daily: [],
    recent: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadStats = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      setError("");

        const data = await apiFetch("/api/statistics/blinks");

        console.log("Dữ liệu thống kê nhận được:", data);
        setStats(data);

      setStats({
        total: data.total ?? 0,
        devices: data.devices ?? [],
        daily: data.daily ?? [],
        recent: data.recent ?? [],
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);

      const message =
        err?.message ??
        err?.response?.data?.message ??
        err?.data?.message ??
        (typeof err === "string" ? err : null) ??
        "Không xác định được nguyên nhân";

      setError(`Không thể tải thống kê (${message})`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(true);

    const timer = setInterval(() => {
      loadStats(false);
    }, 5000);

    return () => clearInterval(timer);
  }, [loadStats]);

  return (
    <main className="blink-statistics">
      <header className="blink-page-header">
        <div>
          <h1>Thống kê nháy đèn</h1>
          <p>
            Theo dõi số lần nháy của từng đèn cảnh báo
            theo cảm biến.
          </p>
        </div>

        <button
          className="blink-refresh-button"
          onClick={() => loadStats(true)}
          disabled={loading}
        >
          ↻ Làm mới
        </button>
      </header>

      {error && (
        <div className="blink-error">
          {error}
        </div>
      )}

      <section className="blink-overview">
        <article className="blink-total-card">
          <span className="blink-total-label">
            Tổng số lần nháy
          </span>

          <strong>
            {loading ? "..." : stats.total.toLocaleString("vi-VN")}
          </strong>

          <span className="blink-total-caption">
            Tổng cộng của cả 3 đèn
          </span>
        </article>

        {LED_INFO.map((led) => {
          const item = stats.devices.find(
            (device) => device.deviceId === led.id
          );

          return (
            <article
              className="blink-card"
              key={led.id}
              style={{ "--led-color": led.color }}
            >
              <div className="blink-card-top">
                <span className="blink-indicator" />
                <span>{led.name}</span>
                <span className="blink-card-sensor">
                  {led.sensor}
                </span>
              </div>

              <strong className="blink-card-count">
                {loading
                  ? "..."
                  : (item?.total ?? 0).toLocaleString("vi-VN")}
              </strong>

              <p>{led.description}</p>

              <div className="blink-card-footer">
                <span>Hôm nay</span>
                <strong>
                  {(item?.today ?? 0).toLocaleString("vi-VN")}
                  {" "}lần
                </strong>
              </div>
            </article>
          );
        })}
      </section>

      <section className="blink-panel">
        <div className="blink-panel-header">
          <div>
            <h2>Số lần nháy trong 7 ngày</h2>
            <p>
              So sánh số lần nháy của ba đèn theo ngày.
            </p>
          </div>
        </div>

        <div className="blink-chart">
          {stats.daily.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.daily}
                margin={{
                  top: 12,
                  right: 16,
                  left: 0,
                  bottom: 4,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Số lần nháy",
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="led1"
                  name="Đèn 1 - Nhiệt độ"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="led2"
                  name="Đèn 2 - Độ ẩm"
                  fill="#2367EE"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="led3"
                  name="Đèn 3 - Ánh sáng"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="blink-empty">
              Chưa có dữ liệu thống kê.
            </div>
          )}
        </div>
      </section>

      <section className="blink-panel">
        <div className="blink-panel-header">
          <div>
            <h2>Lịch sử nháy gần đây</h2>
            <p>
              20 sự kiện nháy đèn mới nhất được ghi nhận.
            </p>
          </div>
        </div>

        <div className="blink-table-wrapper">
          <table className="blink-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Đèn</th>
                <th>Cảm biến</th>
                <th>Sự kiện</th>
              </tr>
            </thead>

            <tbody>
              {stats.recent.length === 0 ? (
                <tr>
                  <td colSpan="4" className="blink-empty-cell">
                    Chưa có sự kiện nháy nào.
                  </td>
                </tr>
              ) : (
                stats.recent.map((event) => {
                  const led = LED_INFO.find(
                    (item) => item.id === event.deviceId
                  );

                  return (
                    <tr key={event.id}>
                      <td>{formatDate(event.occurredAt)}</td>
                      <td>{led?.name ?? `Đèn ${event.deviceId}`}</td>
                      <td>
                        {led?.sensor ?? event.sensorType}
                      </td>
                      <td>
                        <span className="blink-event-badge">
                          Hoàn thành 1 lần nháy
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {lastUpdated && (
          <p className="blink-last-updated">
            Cập nhật lần cuối:{" "}
            {lastUpdated.toLocaleTimeString("vi-VN")}
          </p>
        )}
      </section>
    </main>
  );
}
