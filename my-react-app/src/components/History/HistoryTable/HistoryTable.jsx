import HistoryPagination from "../HistoryPagination/HistoryPagination";
import "./HistoryTable.css"


const histories = [
    {
        id: 1,
        device: "LED 1",
        action: "ON",
        status: "ON",
        time: "11:00 13/08/2026"
    },
    {
        id: 1,
        device: "LED 1",
        action: "ON",
        status: "ON",
        time: "11:00 13/08/2026"
    },
    {
        id: 1,
        device: "LED 1",
        action: "ON",
        status: "ON",
        time: "11:00 13/08/2026"
    },
    {
        id: 1,
        device: "LED 1",
        action: "ON",
        status: "ON",
        time: "11:00 13/08/2026"
    },
    {
        id: 1,
        device: "LED 1",
        action: "ON",
        status: "ON",
        time: "11:00 13/08/2026"
    },
];
function HistoryTable() {
    return (
        <div className="history-table-wrapper">
            <table className="history-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thiết bị</th>
                        <th>Hành động</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {histories.map((history) => (
                        <tr key={history.id}>
                            <td>{history.id}</td>
                            <td className="divice">{history.device}</td>
                            <td className="action">{history.action}</td>
                            <td className="status">{history.status}</td>
                            <td className="time">{history.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <HistoryPagination />
        </div>
    )
}
export default HistoryTable