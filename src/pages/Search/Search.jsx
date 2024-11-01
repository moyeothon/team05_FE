import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { diaryData } from '../../dummyData/diaryData';
import DiarySection from '../../components/DiarySection/DiarySection';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBack = () => {
    navigate('/calendar');
  };

  // 검색어와 일치하는 일기 
  const filteredDiaries = diaryData.filter(diary => 
    diary.feelings.some(feeling => feeling.includes(searchTerm))
  );

  return (
    <div className='search-container'>
      <div className='input-part'>
        <div className='back-Arrow' onClick={handleBack}></div>
        <div className="input-container">
            <CiSearch className="search-icon" />
            <input 
              placeholder="찾고 싶은 감정 키워드를 입력하세요." 
              value={searchTerm}
              onChange={handleSearch}
            />
        </div>
      </div>

      {searchTerm !== '' && filteredDiaries.length > 0 && (
        <div className='search-results'>
          {filteredDiaries.map(diary => (
            <DiarySection 
              key={diary.id}
              diaryData={diary}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;