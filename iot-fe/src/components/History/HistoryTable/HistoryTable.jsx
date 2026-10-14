import HistoryPagination from "../HistoryPagination/HistoryPagination";
import "./HistoryTable.css";
import { useState } from "react";
import { useEffect } from "react";

function HistoryTable({ filters, currentPage, onPageChange }) {
    const [histories, setHistories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
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

        onPageChange(0);
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: currentPage,
                    size: pageSize,
                    sortBy: sortConfig.key === "device" ? "device.name" : 
                        sortConfig.key, direction: sortConfig.direction
                });
                Object.entries(filters).forEach(([key, value]) => {
                    if (value && value.trim() !== "") {
                        params.append(key, value.trim());
                    }
                });
                const url = `http://localhost:8080/api/history/search?${params.toString()}`;
                console.log(url);
                const response = await fetch(url, {
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                setHistories(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Lỗi tải lịch sử:", error);
                    setHistories([]);
                    setTotalPages(0);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
        return () => controller.abort();
    }, [currentPage, filters, sortConfig, pageSize]);

    const getIcon = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };
    return (
        <div className="history-table-wrapper">
            <table className="history-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("id")}>ID {getIcon("id")}</th>
                        <th onClick={() => handleSort("device")}>Thiết bị {getIcon("device")}</th>
                        <th onClick={() => handleSort("action")}>Hành động {getIcon("action")}</th>
                        <th onClick={() => handleSort("status")}>Trạng thái {getIcon("status")}</th>
                        <th onClick={() => handleSort("createdAt")}>Thời gian {getIcon("createdAt")}</th>
                        <th onClick={() => handleSort("userId")}>Người dùng {getIcon("userId")}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="5">Đang tải dữ liệu...</td></tr>
                    ) : histories.length === 0 ? (
                        <tr><td colSpan="5">Không tìm thấy lịch sử phù hợp</td></tr>
                    ) : (
                        histories.map(history => (
                            <tr key={history.id}>
                                <td>{history.id}</td>
                                <td className="device">{history.device?.name}</td>
                                <td className="action">{history.action}</td>
                                <td className="status">{history.status}</td>
                                <td className="createdAt">{history.createdAt}</td>
                                <td className="user">{history.userId}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <HistoryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPageSizeChange={(size) =>{
                    onPageChange(0);
                    setPageSize(size);
                }}
            />
        </div>
    );
}
export default HistoryTable;