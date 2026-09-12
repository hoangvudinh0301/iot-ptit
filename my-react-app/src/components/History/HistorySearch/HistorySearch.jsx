import "./HistorySearch.css"

function HistorySearch() {
    return (
        <div className="history-search">
            <select>
                <option value="">Tìm kiếm theo</option>
                <option value="">Tất cả</option>
                <option value="">Thời gian</option>
                <option value="">Thiết bị</option>
            </select>
            <input type="text" placeholder="Nhập giá trị tìm kiếm..."/>
        </div>
    )
}

export default HistorySearch