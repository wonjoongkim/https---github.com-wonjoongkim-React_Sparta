import { useState } from "react";
import '../App.css';

export function SearchField() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className='search-bar'>
      <input placeholder="Search" onChange={handleSearch} className='search-input' />
    </div>
  );
}

export default SearchField;
