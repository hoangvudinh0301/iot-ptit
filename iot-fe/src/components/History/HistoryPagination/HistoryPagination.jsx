import "./HistoryPagination.css";

function HistoryPagination({ currentPage, totalPages, onPageChange }) {

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
            <select onChange={(e) => {
                }}>
                    <option value="">10</option>
                    <option value="all">20</option>
                    <option value="time">30</option>
            </select>
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