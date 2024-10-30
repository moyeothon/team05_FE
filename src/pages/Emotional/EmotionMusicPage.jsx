
import { useState, useEffect, useRef } from "react"
import Header from "../../components/Header"
import AIBtn from "../../components/Emotional/AIBtn"
import axios from 'axios';
import emotions from '../../assets/emotions.json';

import "./EmotionMusicPage.css"

const DiaryContent = ({ diaryText }) => {
    return (
        <div className="diary-content-background">
            <div className="diary-content-box">
                <div className="diary-content">
                    <p>{diaryText}</p>
                </div>
            </div>
        </div>
    )
}

const MusicItem = ({ track, isSelected, onSelect }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // 오디오 재생이 끝났을 때 상태 업데이트
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, []);

    return (
        <div 
            className={`music-item ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="music-info">
                <img 
                    src={track.album.images[0]?.url} 
                    alt="앨범 커버" 
                    className="album-cover"
                />
                <div className="song-details">
                    <h3 className="song-title">{track.name}</h3>
                    <p className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
            </div>
            <div className="music-controls">
                {track.preview_url && (
                    <button className="play-button" onClick={togglePlay}>
                        <audio ref={audioRef} src={track.preview_url} />
                        <img 
                            src={isPlaying ? "/pause_icon.svg" : "/play_icon.svg"} 
                            alt={isPlaying ? "일시정지" : "재생"} 
                        />
                    </button>
                )}
                <a 
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="options-button"
                >
                    <img src="/more_options.svg" alt="스포티파이에서 열기" />
                </a>
            </div>
        </div>
    );
};

const Todays = ({ diaryText }) => {
    const [analyzedEmotions, setAnalyzedEmotions] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [token, setToken] = useState(null);
    const [musicRecommendations, setMusicRecommendations] = useState({});
    const [selectedMusicId, setSelectedMusicId] = useState(null);

    const analyzeDiary = async (text) => {
        setIsAnalyzing(true);
        const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `이 일기의 감정을 분석하여 기쁨,감사,만족,사랑,뿌듯함,활력,여유,기대감,슬픔,외로움,아쉬움,후회,불안,피로,실망,서운함,혼란,놀람,고민,설렘,부담,의심,두려움,위안 중 3가지를 골라 출력해줘 "${text}"`,
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`,
                    },
                }
            );

            const emotionResult = response.data.choices[0].message.content;
            console.log('감정 분석 결과:', emotionResult);

            const detectedEmotions = emotionResult.match(/[가-힣]+/g) || [];
            setAnalyzedEmotions(detectedEmotions.filter(emotion => emotions[emotion]).slice(0, 3));
            
        } catch (error) {
            console.error('감정 분석 중 오류가 발생했습니다:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        const getSpotifyToken = async () => {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(
                        `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`
                    )
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
            setToken(data.access_token);
        };
        getSpotifyToken();
    }, []);

    useEffect(() => {
        const getMusicRecommendations = async (emotion) => {
            if (!token || !emotions[emotion]) return;

            const params = {
                seed_artists: '3HqSLMAZ3g3d5poNaI7GOU,6HvZYsbFfjnjFrWF950C9d,7n2Ycct7Beij7Dj7meI4X0,2YXlV7PEHYKlF0sxiHiLgE',
                market: 'KR',
                limit: '1',
                min_popularity: '5',
                target_valence: emotions[emotion].target_valence,
                target_energy: emotions[emotion].target_energy,
                target_tempo: emotions[emotion].target_tempo
            };

            try {
                const response = await fetch(
                    'https://api.spotify.com/v1/recommendations?' + new URLSearchParams(params),
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                const data = await response.json();
                setMusicRecommendations(prev => ({
                    ...prev,
                    [emotion]: data.tracks[0]
                }));
            } catch (error) {
                console.error('음악 추천 중 오류:', error);
            }
        };

        analyzedEmotions.forEach(emotion => {
            getMusicRecommendations(emotion);
        });
    }, [analyzedEmotions, token]);

    useEffect(() => {
        if (analyzedEmotions.length > 0 && musicRecommendations[analyzedEmotions[0]]) {
            setSelectedMusicId(musicRecommendations[analyzedEmotions[0]].id);
        }
    }, [analyzedEmotions, musicRecommendations]);

    return (
        <div className="todays-section">
            <div className="todays-content">
                <div className="todays-item">
                    <div className="todays-header">
                        <img src="/smile.svg" alt="감정 아이콘" />
                        <h2>오늘의 감정</h2>
                    </div>
                    <div className="todays-buttons">
                        {analyzedEmotions.length === 0 ? (
                            <AIBtn 
                                text={isAnalyzing ? "분석중..." : "AI로 추출"} 
                                onClick={() => analyzeDiary(diaryText)}
                                disabled={isAnalyzing}
                            />
                        ) : (
                            <div className="emotion-tags">
                                {analyzedEmotions.map((emotion, index) => (
                                    <span key={index} className="emotion-tag">
                                        #{emotion}
                                    </span>
                                ))}
                            </div>
                        )}
                        <button className="plus-button">
                            <img src="/emotion_add_button.svg" alt="감정 추가" />
                            <span>최대 5개</span>
                        </button>
                    </div>
                </div>
                
                <div className="todays-item music">
                    <div className="todays-header">
                        <img src="/music.svg" alt="음악 아이콘" />
                        <h2>오늘의 음악</h2>
                    </div>

                    {analyzedEmotions.length > 0 ? (
                        <div className="music-recommendations">
                            {analyzedEmotions.map((emotion, index) => (
                                <div key={index} className="music-recommendation-group">
                                    <span className="emotion-tag">#{emotion}</span>
                                    {musicRecommendations[emotion] && 
                                        <MusicItem 
                                            track={musicRecommendations[emotion]}
                                            isSelected={selectedMusicId === musicRecommendations[emotion].id}
                                            onSelect={() => setSelectedMusicId(musicRecommendations[emotion].id)}
                                        />
                                    }
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="music-empty-state">
                            <p>오늘의 감정이 정해지면 음악을 추천받을 수 있어요!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function EmotionMusicPage() {

    const [diaryText, setDiaryText] = useState(`오늘은 아침부터 왠지 모르게 설렘이 가득한 하루였다. 눈을 뜨자마자 창문으로 들어오는 햇살이 참 따스해서 기분이 좋아졌고, 그 느낌을 담아 하루를 시작했다. 출근길에는 좋아하는 노래를 듣고, 간간히 스쳐가는 가을바람에 행복이 묻어나는 듯했다.
점심때는 동료들과 한껏 웃으며 시간을 보냈다. 웃음소리가 사무실을 가득 채우는 순간들이 참 소중하다는 걸 느꼈다. 오후 내내 마음이 기쁘고 가볍게 날아다니는 기분이 들었다.`);

    return (
        <div className="emotion-music-page">
            <Header/>
            <DiaryContent diaryText={diaryText}/>
            <Todays diaryText={diaryText} />

        </div>
    )
}

export default EmotionMusicPage