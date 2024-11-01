import React from 'react';
import moment from 'moment';
import './DiarySection.css';
import { useNavigate } from 'react-router-dom';
import MusicItem from '../Music/MusicItem';

const DiarySection = ({ value, playbutton, diaryData }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/diary-detail', {
            state: {
                diaryText: diaryData.content,
                emotions: diaryData.emotions,
                musicData: {
                    song: diaryData.music.title,
                    artist: diaryData.music.artist,
                    image: diaryData.music.imagePath,
                    preview: diaryData.music.previewUrl,
                    external_urls: diaryData.music.external_urls
                },
                date: diaryData.createAt
            }
        });
    };

    return (
        <div className='diary-section' onClick={handleClick}>
            <div className="emotion-tags-2">
                {diaryData.emotions && diaryData.emotions.map((emotion, index) => (
                    <span key={index} className="emotion-tag-2">#{emotion}</span>
                ))}
            </div>

            <div className='diary-content'>
                <p>{diaryData.content}</p>
            </div>

            {diaryData.music && (
                <MusicItem 
                    track={{
                        image: diaryData.music.imagePath,
                        name: diaryData.music.title,
                        artist: diaryData.music.artist,
                        preview_url: diaryData.music.previewUrl,
                        external_urls: diaryData.music.external_urls
                    }}
                    onSelect={(e) => {
                        e.stopPropagation();
                    }}
                />
            )}

            <div className='diary-date'>
                {moment(diaryData.createAt).format("YYYY년 MM월 DD일")}
            </div>
        </div>
    );
};

export default DiarySection; 