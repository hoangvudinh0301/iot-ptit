import "./SensorSearch.css"
import {useState} from "react"

function SensorSearch() {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className="sensor-search">
            
            <select value={searchType} onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue("");
            }}>
                <option value="">Tìm kiếm theo</option>
                <option value="all">Tất cả</option>
                <option value="time">Thời gian</option>
                <option value="sensor">Cảm biến</option>
            </select>
            {searchType === "time" ? (
                <input type="date" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
            ) : (
                <input type="text" placeholder="Nhập giá trị tìm kiếm..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
            )}
        </div>
    )
}

export default SensorSearch