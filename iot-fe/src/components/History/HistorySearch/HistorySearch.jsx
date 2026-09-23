import "./HistorySearch.css"
import {useState} from "react"

function HistorySearch({onSearch}) {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        onSearch(searchType, searchValue)
    }

    return (
        <div className="history-search">
            <select value={searchType} onChange={(e) => {
                setSearchType(e.target.value);
                setSearchValue("");
            }}>
                <option value="">Tìm kiếm theo</option>
                <option value="all">Tất cả</option>
                <option value="time">Thời gian</option>
                {/* <option value="device">Thiết bị</option>
                <option value="action">Hành động</option>
                <option value="action">Trạng thái</option> */}
            </select>
            <input type="text" placeholder="Nhập giá trị tìm kiếm..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
            <select onChange={(e) => {
                }}>
                    <option value="">Thiết bị</option>
                    <option value="all">LED1</option>
                    <option value="time">LED2</option>
                </select>
                <select onChange={(e) => {
                }}>
                    <option value="">Hành động</option>
                    <option value="all">ON</option>
                    <option value="time">OFF</option>
                </select>

                <select onChange={(e) => {
                }}>
                    <option value="">Trạng thái<i></i></option>
                    <option value="all">ON</option>
                    <option value="time">OFF</option>
                </select>
            <button onClick={handleSearch}>Tìm kiếm</button>
            <div className="filter">
                
            </div>
        </div>
        
    )
}

export default HistorySearch