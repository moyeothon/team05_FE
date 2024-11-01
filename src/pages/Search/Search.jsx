import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import moment from 'moment';
import playbutton from '../../assets/playbutton.png';
import './Search.css';

const Search = () => {
  const [value, onChange] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 일기 목록
  const diaryList = [
    {
      id: 1,
      tags: ['행복', '설렘'],
      content: '오늘은 아침부터 부쩍 차가워진 공기에 몸이 움츠러들었지만, 하늘이 맑아서...',
      song: { title: '노래제목1', artist: '가수명1' },
      date: new Date('2024-03-15')
    },
    {
      id: 2,
      tags: ['행복', '기쁨'],
      content: '어렵다 어려워...',
      song: { title: '노래제목2', artist: '가수명2' },
      date: new Date('2024-03-14')
    },
    {
      id: 3,
      tags: ['설렘', '기쁨'],
      content: '어려운데...',
      song: { title: '노래제목3', artist: '가수명3' },
      date: new Date('2024-03-13')
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBack = () => {
    navigate('/calendar');
  };

  // 검색어와 일치하는 일기 
  const filteredDiaries = diaryList.filter(diary => 
    diary.tags.some(tag => tag.includes(searchTerm))
  );

  return (
    <div className='search-container'>
      <div className='input-part'>
        <div className='back-Arrow' onClick={handleBack}></div>
        <div className="input-container">
            <CiSearch className="search-icon" />
            <input 
              placeholder="검색어를 입력하세요." 
              value={searchTerm}
              onChange={handleSearch}
            />
        </div>
      </div>

      {searchTerm !== '' && filteredDiaries.length > 0 && (
        <div className='search-results'>
          {filteredDiaries.map(diary => (
            <div key={diary.id} className='diary-section'>
              <div className="emotion-tags">
                {diary.tags.map(tag => (
                  <span key={tag} className="emotion-tag">#{tag}</span>
                ))}
              </div>

              <div className='diary-content'>
                <p>{diary.content}</p>
              </div>

              <div className='music-item'>
                <div className='music-info'>
                  <div className='album-cover'></div>
                  <div className='song-details'>
                    <h3 className='song-title'>{diary.song.title}</h3>
                    <p className='artist-name'>{diary.song.artist}</p>
                  </div>
                </div>
                <button className='play-button'>
                  <img src={playbutton} alt="" />
                </button>
              </div>

              <div className='diary-date'>
                {moment(diary.date).format("YYYY년 MM월 DD일")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;