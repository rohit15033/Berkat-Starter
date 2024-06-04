// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search users..."
      />
    </div>
  );
};

export default SearchBar;
