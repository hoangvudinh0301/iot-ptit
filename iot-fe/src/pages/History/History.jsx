import { useState } from "react"
import HistorySearch from "../../components/History/HistorySearch/HistorySearch"
import HistoryTable from "../../components/History/HistoryTable/HistoryTable"
import "./History.css"

function History() {
    const [filters, setFilters] = useState({
        time: "",
        deviceName: "",
        action: "",
        status: ""
    })
    const [currentPage, setCurrentPage] = useState(0);

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(0);
    };

    return (
        <div className="history">
            <HistorySearch onSearch={handleSearch}/>
            <HistoryTable filters={filters} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
    )
}
export default History