import "./SensorSearch.css"
import {useState} from "react"

function SensorSearch( { onSearch }) {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [error, setError] = useState(false);
    const handleSearch = () => {
        if (searchType !== "all" && !searchValue.trim()) {
            setError(true);
            return;
        }
        setError(false);
        onSearch(searchType, searchValue);
    }

    return (
        <div className="sensor-search">
            
            <select 
                value={searchType} 
                onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setError(false);
            }}>
                <option value="">Tìm kiếm theo</option>
                <option value="all">Tất cả</option>
                <option value="time">Thời gian</option>
                <option value="temperature">Nhiệt độ</option>
                <option value="humidity">Độ ẩm</option>
                <option value="light">Ánh sáng</option>
            </select>
            <input type="text" className={error ? "input-error" : ""}
                placeholder={error ? "Vui lòng nhập giá trị tìm kiếm" : "Nhập giá trị tìm kiếm..."}
                value={searchValue} 
                onChange={(e) => {
                    setSearchValue(e.target.value); 
                    setError("")}}/>
            <button onClick={handleSearch} disabled={searchType === ""}>Tìm kiếm</button>
        </div>
    )
}

export default SensorSearch