import "./HistorySearch.css"
import {useState} from "react"

function HistorySearch({onSearch}) {
    const [filters, setFilters] = useState({
        time: "",
        deviceName: "",
        action: "",
        status: ""
    });
    const handleChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };
    const handleSearch = () => {
        onSearch({...filters});
    };
    return (
        <div className="history-search">
            <input type="text" placeholder="Nhập thời gian tìm kiếm..." 
                    value={filters.time} 
                    onChange={(e) => handleChange("time", e.target.value)}/>
            <select value={filters.deviceName} 
                onChange={(e) => handleChange("deviceName", e.target.value)}>
                <option value="">Thiết bị</option>
                <option value="LED1">LED1</option>
                <option value="LED2">LED2</option>
            </select>
            <select value={filters.action} onChange={(e) => handleChange("action", e.target.value)}>
                <option value="">Hành động</option>
                <option value="ON">ON</option>
                <option value="OFF">OFF</option>
            </select>
            <select value={filters.status} onChange={(e) => handleChange("status", e.target.value)}>
                <option value="">Trạng thái</option>
                <option value="PENDING">PENDING</option>
                <option value="ON">ON</option>
                <option value="OFF">OFF</option>
            </select>
            <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
        
    )
}

export default HistorySearch