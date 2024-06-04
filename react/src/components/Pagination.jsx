// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  return (
    <div className="pagination-buttons">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous Page
      </button>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === lastPage}>
        Next Page
      </button>
    </div>
  );
};

export default Pagination;
