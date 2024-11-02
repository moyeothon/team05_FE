import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import MusicItem from '../../components/Music/MusicItem';
import moment from 'moment';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDiaryClick = (diary) => {
    navigate('/diary-detail', {
      state: {
        diaryText: diary.content,
        emotions: diary.emotionTypes,
        musicData: diary.musicList?.[0] ? {
          song: diary.musicList[0].title,
          artist: diary.musicList[0].artist,
          image: diary.musicList[0].imagePath,
          preview: diary.musicList[0].previewUrl,
          external_urls: diary.musicList[0].external_urls
        } : null,
        date: diary.createDate
      }
    });
  };

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      setDiaries([]);
      return;
    }

    setIsLoading(true);
    try {
      const userNickname = localStorage.getItem('userNickname');
      const response = await axios.get(
        `https://junyeongan.store/api/diary?userNickname=${userNickname}`
      );
      
      if (response.status === 200) {
        const filteredDiaries = response.data.filter(diary => 
          diary.emotionTypes?.some(emotion => 
            emotion.toLowerCase().includes(searchValue.toLowerCase())
          )
        );
        setDiaries(filteredDiaries);
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setDiaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='search-container'>
      <div className='input-part'>
        <div className='back-Arrow' onClick={() => navigate('/calendar')}></div>
        <div className="input-container">
          <CiSearch className="search-icon" />
          <input 
            placeholder="찾고 싶은 감정 키워드를 입력하세요." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading">검색 중...</div>
      ) : (
        <>
          {!searchTerm ? null : diaries.length === 0 ? (
            <div className="no-results">검색 결과가 없습니다.</div>
          ) : (
            <div className='search-results'>
              {diaries.map((diary, index) => (
                <div 
                  key={index} 
                  className='diary-section'
                  onClick={() => handleDiaryClick(diary)}
                >
                  <div className="emotion-tags-2">
                    {(diary.emotionTypes || []).map((emotion, i) => (
                      <span key={i} className="emotion-tag-2">
                        #{emotion}
                      </span>
                    ))}
                  </div>
                  
                  <div className='diary-content'>
                    <p>{diary.content}</p>
                  </div>

                  {diary.musicList?.[0] && (
                    <MusicItem 
                      track={{
                        image: diary.musicList[0].imagePath,
                        name: diary.musicList[0].title,
                        artist: diary.musicList[0].artist,
                        preview_url: diary.musicList[0].previewUrl,
                        external_urls: diary.musicList[0].external_urls
                      }}
                      onSelect={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  )}

                  <div className='diary-date'>
                    {moment(diary.createDate).format("YYYY년 MM월 DD일")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;