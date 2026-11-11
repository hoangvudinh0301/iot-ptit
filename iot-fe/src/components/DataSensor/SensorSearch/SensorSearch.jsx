
import "./SensorSearch.css";
import { useState } from "react";

function SensorSearch({ onSearch }) {
    const [searchType, setSearchType] = useState("all");
    const [searchValue, setSearchValue] = useState("");
    const [error, setError] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();

        const value = searchValue.trim();

        if (searchType !== "all" && !value) {
            setError(true);
            return;
        }

        setError(false);
        onSearch(searchType, value);
    };

    return (
        <form className="sensor-search" onSubmit={handleSearch}>
            <select
                value={searchType}
                onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchValue("");
                    setError(false);
                }}
            >
                <option value="all">Tất cả</option>
                <option value="time">Thời gian</option>
                <option value="temperature">Nhiệt độ</option>
                <option value="humidity">Độ ẩm</option>
                <option value="light">Ánh sáng</option>
            </select>

            <input
                type="text"
                className={error ? "input-error" : ""}
                placeholder={
                    error
                        ? "Vui lòng nhập giá trị tìm kiếm"
                        : "Nhập giá trị tìm kiếm..."
                }
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    setError(false);
                }}
            />

            <button type="submit">
                Tìm kiếm
            </button>
        </form>
    );
}

export default SensorSearch;
