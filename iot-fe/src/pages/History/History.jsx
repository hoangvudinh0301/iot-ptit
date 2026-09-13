import HistorySearch from "../../components/History/HistorySearch/HistorySearch"
import HistoryTable from "../../components/History/HistoryTable/HistoryTable"
import "./History.css"

function History() {
    return (
        <div className="history">
            <HistorySearch />
            <HistoryTable />
        </div>
    )
}
export default History