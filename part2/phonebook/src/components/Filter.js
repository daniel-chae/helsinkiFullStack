import React from "react";

// From here ----------------------------------------------------------> Filter component
const Filter = ({ filter, onFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={onFilterChange} />
  </div>
);

export default Filter;
