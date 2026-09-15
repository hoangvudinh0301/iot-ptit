import { useState } from "react"
import HistorySearch from "../../components/History/HistorySearch/HistorySearch"
import HistoryTable from "../../components/History/HistoryTable/HistoryTable"
import "./History.css"

function History() {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(0);

    const handleSearch = (type, value) => {
        setSearchType(type);
        setSearchValue(value);
        setCurrentPage(0);
    }

    return (
        <div className="history">
            <HistorySearch onSearch={handleSearch}/>
            <HistoryTable searchType={searchType} searchValue={searchValue} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
    )
}
export default History