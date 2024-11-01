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
                emotions: diaryData.feelings,
                musicData: {
                    song: diaryData.song,
                    artist: diaryData.artist,
                    image: diaryData.image,
                    preview: diaryData.preview,
                    external_urls: diaryData.external_urls
                },
                date: diaryData.createAt
            }
        });
    };

    return (
        <div className='diary-section' onClick={handleClick}>
            <div className="emotion-tags-2">
                {diaryData.feelings.map((feeling, index) => (
                    <span key={index} className="emotion-tag-2">#{feeling}</span>
                ))}
            </div>

            <div className='diary-content'>
                <p>{diaryData.content}</p>
            </div>

            <MusicItem 
                track={{
                    image: diaryData.image,
                    name: diaryData.song,
                    artist: diaryData.artist,
                    preview_url: diaryData.preview,
                    external_urls: diaryData.external_urls
                }}
                onSelect={(e) => {
                    e.stopPropagation();
                }}
            />

            <div className='diary-date'>
                {moment(diaryData.createAt).format("YYYY년 MM월 DD일")}
            </div>
        </div>
    );
};

export default DiarySection; 