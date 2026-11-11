import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCalendarDays,
  faChartColumn,
  faLightbulb,
  faRotateRight,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../services/api";
import "./VirtualSensors.css";

const SENSOR_CONFIG = [
  { key: "virtual1", index: 4, name: "Nồng độ khí CO₂", min: 1, max: 100, threshold: 50, gpio: 17, color: "#2367ee" },
  { key: "virtual2", index: 5, name: "Độ ồn môi trường", min: 101, max: 200, threshold: 150, gpio: 4, color: "#8b5cf6" },
  { key: "virtual3", index: 6, name: "Bụi mịn PM2.5", min: 201, max: 300, threshold: 250, gpio: 2, color: "#f59e0b" },
];

function currentLocalDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function displayDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatCount(value) {
  return Number(value ?? 0).toLocaleString("vi-VN");
}

function formatTime(value) {
  if (!value) return "Chưa có dữ liệu";
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

export default function VirtualSensors() {
  const [selectedDate, setSelectedDate] = useState(currentLocalDate);
  const [data, setData] = useState({ totalExceedances: 0, sensors: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const result = await apiFetch(`/api/virtual-sensors?date=${encodeURIComponent(selectedDate)}`);
      setData(result);
      setError("");
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || "Không lấy được dữ liệu thống kê");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    // Date selection changes what is counted, live LED status is always current.
    const initialTimer = window.setTimeout(() => loadData(), 0);
    const timer = window.setInterval(() => loadData(), 4000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [loadData]);

  const sensors = SENSOR_CONFIG.map((config) => ({
    ...config,
    ...(data.sensors?.find(
      (sensor) => sensor.key === config.key
    ) ?? {}),

    // Luon uu tien ten do Frontend quy dinh
    name: config.name,
    color: config.color,
    index: config.index,
  }));

  const onlineSensors = sensors.filter((sensor) => sensor.online).length;
  const warningSensors = sensors.filter((sensor) => sensor.online && sensor.aboveThreshold).length;

  return (
    <main className="virtual-page">
      <header className="virtual-header">

        <div className="virtual-actions">
          <label className="virtual-date-field">
            <FontAwesomeIcon icon={faCalendarDays} />
            <span>Chọn ngày</span>
            <input
              type="date"
              aria-label="Ngày cần xem thống kê"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value || currentLocalDate())}
            />
          </label>
          <button
            type="button"
            className="virtual-refresh"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <FontAwesomeIcon icon={faRotateRight} spin={refreshing} /> Làm mới
          </button>
        </div>
      </header>

      {error && <div className="virtual-error" role="alert">Không tải được dữ liệu: {error}</div>}
      <section className="virtual-grid" aria-label="Ba ô thống kê vượt ngưỡng">
        {sensors.map((sensor) => {
          const percentage = sensor.samples ? Math.round((sensor.count / sensor.samples) * 100) : 0;
          return (
            <article className="virtual-card virtual-stat-card" key={sensor.key} style={{ "--virtual-accent": sensor.color }}>
              <h3>{sensor.name}</h3>
              <p className="virtual-card-subtitle">Ngưỡng cảnh báo: <b>{sensor.threshold}</b> / {sensor.max} (50% max)</p>
              <div className="virtual-main-number">
                <strong>{loading ? "…" : formatCount(sensor.count)}</strong>
                <span>lần vượt ngưỡng</span>
              </div>
              <div className="virtual-progress-title">
                <span>Tỷ lệ mẫu vượt ngưỡng</span><b>{percentage}%</b>
              </div>
              <div className="virtual-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
                <span style={{ width: `${percentage}%` }} />
              </div>
              <div className="virtual-stat-footer">
                <span>Số mẫu ngày đã chọn</span><strong>{formatCount(sensor.samples)}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <div className="virtual-section-heading virtual-second-heading">
      </div>
      <section className="virtual-grid" aria-label="Ba ô mô phỏng đèn LED">
        {sensors.map((sensor) => {
          const active = Boolean(sensor.online && sensor.aboveThreshold);
          const progress = sensor.value == null ? 0 : Math.max(0, Math.min(100,
            Math.round(((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100)));
          return (
            <article className={`virtual-card virtual-led-card ${active ? "virtual-alarm-active" : ""}`}
              key={sensor.key} style={{ "--virtual-accent": sensor.color }}>
              <div className="virtual-led-header">
                <div>
                  <span className="virtual-led-label">LED {sensor.index}</span>
                  <h3>{sensor.name}</h3>
                </div>
                <span className="virtual-gpio">GPIO {sensor.gpio}</span>
              </div>
              <div className="virtual-led-art" aria-label={active ? "LED đang nhấp nháy" : "LED tắt"}>
                <div className={`virtual-led-glow ${active ? "is-blinking" : ""}`}>
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <span className="virtual-led-ground" />
              </div>
              <div className="virtual-led-status-row">
                <span className={`virtual-led-status ${active ? "is-active" : ""} ${!sensor.online ? "is-offline" : ""}`}>
                  <i /> {!sensor.online ? "MẤT TÍN HIỆU" : active ? "ĐANG NHẤP NHÁY" : "BÌNH THƯỜNG"}
                </span>
                <span className="virtual-led-measure">{sensor.value ?? "—"} <small>/ {sensor.max}</small></span>
              </div>
              <div className="virtual-value-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="virtual-led-footer">
                <span><FontAwesomeIcon icon={faBolt} /> Ngưỡng &gt; {sensor.threshold}</span>
                <span>Cập nhật: {formatTime(sensor.lastUpdated)}</span>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
