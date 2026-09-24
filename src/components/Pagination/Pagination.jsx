import "./Pagination.css";

const Pagination = ({
  page,
  onPageChange,
}) => {

  const changePage = (newPage) => {
    if (newPage < 1) return;

    onPageChange(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="pagination">

      <button
        disabled={page === 1}
        onClick={() => changePage(1)}
      >
        &lt;&lt;
      </button>

      <button
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
      >
        &lt;
      </button>

      {page > 1 && (
        <button
          onClick={() => changePage(page - 1)}
        >
          {page - 1}
        </button>
      )}

      <button className="active-page">
        {page}
      </button>

      <button
        onClick={() => changePage(page + 1)}
      >
        {page + 1}
      </button>

      <button
        onClick={() => changePage(page + 1)}
      >
        &gt;
      </button>

    </div>
  );
};

export default Pagination;