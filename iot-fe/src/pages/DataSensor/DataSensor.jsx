import "./DataSensor.css"
import Header from "../../components/Header"
import SensorSearch from "../../components/DataSensor/SensorSearch/SensorSearch"
import SensorTable from "../../components/DataSensor/SensorTable/SensorTable"
import Pagination from "../../components/DataSensor/Pagination/Pagination"
import { useState } from "react"


function DataSensor() {

    const [searchType, setSearchType] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const handleSearch = (type, value) => {
        setSearchType(type);
        setSearchValue(value);
        setCurrentPage(0);
    }
    return (
        <div className="data-sensor">
            <SensorSearch onSearch={handleSearch} />
            <SensorTable searchType={searchType} searchValue={searchValue} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
    )
}

export default DataSensor