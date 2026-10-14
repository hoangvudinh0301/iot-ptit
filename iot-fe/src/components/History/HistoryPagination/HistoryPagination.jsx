import "./HistoryPagination.css";

function HistoryPagination({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange}) {

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 5);
    if (endPage - startPage < 5) {
        startPage = Math.max(0, endPage - 5);
    }
    const pages = [];
    for (let i = startPage; i < endPage; i++) {
        pages.push(i);
    }
    return (
        <div className="history-pagination">
            <span>Số trang</span>
            <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
            </select>
            <span>Trang {currentPage + 1}/{totalPages}</span>
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >‹</button>
            {pages.map((page) => (
                <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >›</button>
        </div>
    );
}

export default HistoryPagination;