import Pagination from "../Pagination/Pagination";
import { useEffect, useState } from "react";
import "./SensorTable.css"
import { apiFetch } from "../../../services/api";

function SensorTable({ searchType, searchValue, currentPage, onPageChange }) {
    
    const [sensors, setSensors] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [sortConfig, setSortConfig] = useState({
        key: "createdAt",
        direction: "desc"
    });

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc"
        }));
    };

    
    
    useEffect(() => {
        const controller = new AbortController();

        const loadSensors = async () => {
            const params = new URLSearchParams({
                page: currentPage,
                size: pageSize,
                sortBy: sortConfig.key === "sensor"
                    ? "sensor.name"
                    : sortConfig.key,
                direction: sortConfig.direction
            });

            const keyword = searchValue?.trim() ?? "";
            let url;

            if (searchType === "all" || searchType === "") {
                if (keyword) {
                    params.set("keyword", keyword);
                    url = `/api/sensor-data/search/all?${params}`;
                } else {
                    url = `/api/sensor-data/all?${params}`;
                }
            } else if (searchType === "time") {
                params.set("date", keyword);
                url = `/api/sensor-data/search/date?${params}`;
            } else {
                params.set("type", searchType);
                params.set("value", keyword);
                url = `/api/sensor-data/search/sensor?${params}`;
            }

            try {
                const data = await apiFetch(url, {
                    signal: controller.signal
                });

                if (controller.signal.aborted) return;

                setSensors(data?.content ?? []);
                setTotalPages(data?.totalPages ?? 0);

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Lỗi lấy dữ liệu cảm biến:", error);
                    setSensors([]);
                    setTotalPages(0);
                }
            }
        };

        loadSensors();

        return () => controller.abort();

    }, [currentPage, searchType, searchValue, sortConfig, pageSize]);


    const getIcon = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    return (
        <div className="sensor-table-wrapper">
            <table className="sensor-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("id")}>
                            ID {getIcon("id")}
                        </th>

                        <th onClick={() => handleSort("sensor")}>
                            Tên cảm biến {getIcon("sensor")}
                        </th>

                        <th onClick={() => handleSort("value")}>
                            Giá trị {getIcon("value")}
                        </th>

                        <th onClick={() => handleSort("createdAt")}>
                            Thời gian {getIcon("createdAt")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sensors.map((sensor) => (
                        <tr key={sensor.id}>
                            <td>{sensor.id}</td>
                            <td className="sensor">{sensor.sensor?.name}</td>
                            <td className="value">{sensor.value}</td>
                            <td className="createdAt">{sensor.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    onPageChange(0);
                }}/>
        </div>
    )
}
export default SensorTable