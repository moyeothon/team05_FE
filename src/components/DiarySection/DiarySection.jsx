import React from 'react';
import moment from 'moment';
import './DiarySection.css';

const DiarySection = ({ value, playbutton, diaryData }) => {
    return (
        <div className='diary-section'>
            <div className="emotion-tags-2">
                {diaryData.feelings.map((feeling, index) => (
                    <span key={index} className="emotion-tag-2">#{feeling}</span>
                ))}
            </div>

            <div className='diary-content'>
                <p>{diaryData.content}</p>
            </div>

            <div className='music-item'>
                <div className='music-info'>
                    <div className='album-cover'>
                        <img src={diaryData.image} alt="앨범커버" />
                    </div>
                    <div className='song-details'>
                        <h3 className='song-title'>{diaryData.song}</h3>
                        <p className='artist-name'>{diaryData.artist}</p>
                    </div>
                </div>
                <button className='play-button'>
                    <img src={playbutton} alt="재생" />
                </button>
            </div>

            <div className='diary-date'>
                {moment(diaryData.createAt).format("YYYY년 MM월 DD일")}
            </div>
        </div>
    );
};

export default DiarySection; 