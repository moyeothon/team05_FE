import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicItem from '../../components/Music/MusicItem';
import './DiaryDetailPage.css';

const DiaryContent = ({ diaryText }) => {
    return (
        <div className="diary-detail-content-background">
            <div className="diary-detail-content-box">
                <div className="diary-detail-content">
                    <p>{diaryText}</p>
                </div>
            </div>
        </div>
    );
};

const DiaryDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { diaryText, emotions = [], musicData, date } = location.state || {};

    return (
        <div className="diary-detail-page">
            <div className='calendar-header'>
                <button 
                    className="back-button"
                    onClick={() => navigate('/calendar')}
                >
                    뒤로
                </button>
                <h2>MUTE</h2>
            </div>
            <div className="detail-section">
                <DiaryContent diaryText={diaryText} />
                <div className="detail-item">
                    <div className="detail-header">
                        <img src="/smile.svg" alt="감정 아이콘" />
                        <h2>이날의 감정</h2>
                    </div>
                    {emotions && emotions.length > 0 ? (
                        <div className="emotion-tags">
                            {emotions.map((emotion, index) => (
                                <span key={index} className="emotion-tag">
                                    #{emotion}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="no-emotions">
                            등록된 감정이 없습니다
                        </div>
                    )}
                </div>

                <div className="detail-item music">
                    <div className="detail-header">
                        <img src="/music.svg" alt="음악 아이콘" />
                        <h2>이날의 음악</h2>
                    </div>
                    <div className="music-content">
                        {musicData ? (
                            <MusicItem 
                                track={{
                                    name: musicData.song,
                                    artist: musicData.artist,
                                    image: musicData.image,
                                    preview_url: musicData.preview,
                                    external_urls: musicData.external_urls
                                }}
                                isSelected={true}
                            />
                        ) : (
                            <div className="no-music">
                                등록된 음악이 없습니다
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiaryDetailPage; 