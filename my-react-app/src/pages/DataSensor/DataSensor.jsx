import "./DataSensor.css"
import Header from "../../components/Header"
import SensorSearch from "../../components/DataSensor/SensorSearch/SensorSearch"
import SensorTable from "../../components/DataSensor/SensorTable/SensorTable"
import Pagination from "../../components/DataSensor/Pagination/Pagination"


function DataSensor() {
    return (
        <div className="data-sensor">
            <SensorSearch />
            <SensorTable />
        </div>
    )
}

export default DataSensor