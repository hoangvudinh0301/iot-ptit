import "./SensorSearch.css"

function SensorSearch() {
    return (
        <div className="sensor-search">
            <select>
                <option value="">Tìm kiếm theo</option>
                <option value="">Tất cả</option>
                <option value="">Thời gian</option>
                <option value="">Cảm biến</option>
            </select>
            <input type="text" placeholder="Nhập giá trị tìm kiếm..."/>
        </div>
    )
}

export default SensorSearch