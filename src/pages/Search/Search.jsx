import React from 'react'
import './Search.css'
import { CiSearch } from "react-icons/ci";

const Search = () => {
  return (
    <div className='standard'>

      <div className='input-part'>
        <div className='back-Arrow'></div>
        <div className="input-container">
            <CiSearch className="search-icon" />
            <input placeholder="검색어를 입력하세요." />
        </div>
      </div>

    </div>
  )
}

export default Search
