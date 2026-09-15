import "./SensorSearch.css"
import {useState} from "react"

function SensorSearch( { onSearch }) {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        onSearch(searchType, searchValue)
    }

    return (
        <div className="sensor-search">
            
            <select 
                value={searchType} 
                onChange={(e) => {
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

            <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
    )
}

export default SensorSearch