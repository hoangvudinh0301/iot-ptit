import Pagination from "../Pagination/Pagination";
import { useEffect, useState } from "react";
import "./SensorTable.css"


// const sensors = [
//     {
//         id: 1,
//         sensor: "DHT11",
//         value: "30",
//         createdAt: "2026-09-12 17:00:00"
//     },
//     {
//         id: 2,
//         sensor: "DHT11",
//         value: "31",
//         createdAt: "2026-09-12 17:30:00"
//     },
//     {
//         id: 3,
//         sensor: "LDR",
//         value: "32",
//         createdAt: "2026-09-12 17:35:00"
//     },
// ];
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

        let url;
        const sortBy = sortConfig.key || "createdAt";
        const direction = sortConfig.direction;

        if (searchType === "all" || searchType === "") {
            url = `http://localhost:8080/api/sensor-data/all?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`
        } else if (searchType === "time") {
            url = `http://localhost:8080/api/sensor-data/search/date?date=${searchValue}&page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`
        } else if (searchType === "temperature") {
            url = `http://localhost:8080/api/sensor-data/search/sensor?type=temperature&value=${searchValue}&page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`
        } else if (searchType === "humidity") {
            url = `http://localhost:8080/api/sensor-data/search/sensor?type=humidity&value=${searchValue}&page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`
        } else {
            url = `http://localhost:8080/api/sensor-data/search/sensor?type=light&value=${searchValue}&page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&direction=${direction}`
        }
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSensors(data.content);
                console.log(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.error("Lỗi: ", error);
            });
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