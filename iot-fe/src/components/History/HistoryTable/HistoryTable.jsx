import HistoryPagination from "../HistoryPagination/HistoryPagination";
import "./HistoryTable.css";
import { useState } from "react";
import { useEffect } from "react";
// const histories = [
//     {
//         id: 1,
//         device: "LED 1",
//         action: "ON",
//         status: "ON",
//         createdAt: "2026-09-12 17:00:00"
//     },
//     {
//         id: 2,
//         device: "LED 2",
//         action: "ON",
//         status: "ON",
//         createdAt: "2026-09-12 17:30:00"
//     },
//     {
//         id: 3,
//         device: "LED 1",
//         action: "OFF",
//         status: "ON",
//         createdAt: "2026-09-12 17:40:00"
//     },
//     {
//         id: 4,
//         device: "LED 2",
//         action: "OFF",
//         status: "ON",
//         createdAt: "2026-09-12 17:50:00"
//     },
//     {
//         id: 5,
//         device: "LED 2",
//         action: "ON",
//         status: "ON",
//         createdAt: "2026-09-12 17:55:00"
//     },
// ];
function HistoryTable({searchType, searchValue, currentPage, onPageChange}) {

    const [histories, setHistories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    
    const pageSize = 5;
    
    
    useEffect(() => {
        let url;
    
        if (searchType === "all" || searchValue === "") {
            url = `http://localhost:8080/api/history/all?page=${currentPage}&size=${pageSize}`;
        } else if (searchType === "time") {
            url = `http://localhost:8080/api/history/search/date?date=${searchValue}&page=${currentPage}&size=${pageSize}`;
        } else {
            url = `http://localhost:8080/api/history/search/device-name?name=${searchValue}&page=${currentPage}&size=${pageSize}`;
        }
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setHistories(data.content);
                console.log(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => {
                console.error("Lỗi: ", error);
            });
    }, [currentPage, searchValue, searchType]);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    }

    const sortedData = [...histories].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        let valueA;
        let valueB;

        if (sortConfig.key === "device") {
            valueA = a.device?.name || "";
            valueB = b.device?.name || "";
        } else {
            valueA = a[sortConfig.key];
            valueB = b[sortConfig.key];
        }

        if (sortConfig.key === "createdAt") {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        if (valueA < valueB) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
            return sortConfig.direction === "asc" ? 1 : -1
        }

        return 0;
    });

    const getIcon = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };
    return (
        <div className="history-table-wrapper">
            <table className="history-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("id")}>
                            ID {getIcon("id")}
                        </th>

                        <th onClick={() => handleSort("device")}>
                            Thiết bị {getIcon("device")}
                        </th>

                        <th onClick={() => handleSort("action")}>
                            Hành động {getIcon("action")}
                        </th>

                        <th onClick={() => handleSort("status")}>
                            Trạng thái {getIcon("status")}
                        </th>

                        <th onClick={() => handleSort("createdAt")}>
                            Thời gian {getIcon("createdAt")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((history) => (
                        <tr key={history.id}>
                            <td>{history.id}</td>
                            <td className="device">{history.device?.name}</td>
                            <td className="action">{history.action}</td>
                            <td className="status">{history.status}</td>
                            <td className="createdAt">{history.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <HistoryPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}/>
        </div>
    )
}
export default HistoryTable