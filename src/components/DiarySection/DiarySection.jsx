import React from 'react';
import moment from 'moment';
import './DiarySection.css';

const DiarySection = ({ value, playbutton }) => {
    return (
        <div className='diary-section'>
            <div className="emotion-tags-2">
                <span className="emotion-tag">#행복</span>
                <span className="emotion-tag">#설렘</span>
                <span className="emotion-tag">#기쁨</span>
            </div>

            <div className='diary-content'>
                <p>오늘은 아침부터 부쩍 차가워진 공기에 몸이 움츠러들었지만, 하늘이 맑아서...</p>
            </div>

            <div className='music-item'>
                <div className='music-info'>
                    <div className='album-cover'></div>
                    <div className='song-details'>
                        <h3 className='song-title'>노래제목</h3>
                        <p className='artist-name'>가수명</p>
                    </div>
                </div>
                <button className='play-button'>
                    <img src={playbutton} alt="재생" />
                </button>
            </div>

            <div className='diary-date'>
                {moment(value).format("YYYY년 MM월 DD일")}
            </div>
        </div>
    );
};

export default DiarySection; 