import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
}
