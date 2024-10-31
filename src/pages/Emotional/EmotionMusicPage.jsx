import { useState, useEffect, useRef } from "react"
import Header from "../../components/Header"
import AIBtn from "../../components/Emotional/AIBtn"
import axios from 'axios';
import emotions from '../../assets/emotions.json';
import { useLocation } from 'react-router-dom';

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
    const [showOptions, setShowOptions] = useState(false);
    const audioRef = useRef(null);
    const optionsRef = useRef(null);

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

    // 외부 클릭 감지를 위한 useEffect
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                <div className="options-container" ref={optionsRef}>
                    <button 
                        className="options-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions(!showOptions);
                        }}
                    >
                        <img src="/more_options.svg" alt="더보기" />
                    </button>
                    {showOptions && (
                        <div className="options-popup">
                            <button 
                                className="option-item spotify-link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(track.external_urls.spotify, '_blank'); // 스포티파이 링크 열기
                                    setShowOptions(false);
                                }}
                            >
                                스포티파이에서 듣기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmotionSelectModal = ({ isOpen, onClose, selectedEmotions, onEmotionsChange }) => {
    const emotionGroups = [
        {
            emoji: "😊",
            emotions: ["감사", "기쁨", "만족", "사랑", "뿌듯함", "활력", "여유", "기대감", "설렘"]
        },
        {
            emoji: "😇",
            emotions: ["외로움", "고민", "부담", "놀람", "아쉬움", "피로", "위안"]
        },
        {
            emoji: "😨",
            emotions: ["후회", "슬픔", "불안", "의식", "두려움", "혼란", "실망", "서운함"]
        }
    ];

    const [tempEmotions, setTempEmotions] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setTempEmotions([...selectedEmotions]);
        }
    }, [isOpen, selectedEmotions]);

    const handleEmotionToggle = (emotion) => {
        if (tempEmotions.includes(emotion)) {
            // 이미 선택된 감정이면 제거
            setTempEmotions(tempEmotions.filter(e => e !== emotion));
        } else if (tempEmotions.length < 5) {
            // 선택되지 않은 감정이고 5개 미만이면 추가
            setTempEmotions([...tempEmotions, emotion]);
        }
    };

    const handleComplete = () => {
        onEmotionsChange(tempEmotions); // 완료 버튼 클릭 시에만 부모 컴포넌트의 상태 업데이트
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="emotion-modal-overlay" onClick={onClose}>
            <div className="emotion-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>오늘의 감정</h3>
                    <p>최대 5개</p>
                    <button className="close-button" onClick={handleComplete}>완료</button>
                </div>
                <div className="emotion-groups">
                    {emotionGroups.map((group, index) => (
                        <div key={index} className="emotion-group">
                            <div className="emotion-emoji">{group.emoji}</div>
                            <div className="emotion-tags">
                                {group.emotions.map((emotion, i) => {
                                    const isSelected = tempEmotions.includes(emotion);
                                    return (
                                        <button
                                            key={i}
                                            className={`emotion-tag-button ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleEmotionToggle(emotion)}
                                            disabled={!isSelected && tempEmotions.length >= 5}
                                        >
                                            {emotion}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                            content: `이 일기의 감정을 분석하여 기쁨,감사,만족,사랑,뿌듯함,활력,여유,기대감,슬픔,외로움,아쉬움,후회,불안,피로,실망,서운함,혼란,놀람,고민,설렘,부담,의심,두려움,위안 중 3가지를 골라 ��력해줘 "${text}"`,
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
                        `${import.meta.env.VITE_SPOTIFY_CLIENT_ID_2}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET_2}`
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
        const getMusicRecommendations = async (emotion, retryCount = 0) => {
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

                // response 상태 확인
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After') || '30'; // 기본값 30초
                    console.log('전체 응답 헤더:', Object.fromEntries(response.headers));
                    console.log(`Rate limit exceeded. Retry-After: ${retryAfter}초`);
                    
                    // 숫자로 변환하여 사용
                    const waitTime = parseInt(retryAfter, 10) * 1000; // 밀리초 단위로 변환
                    console.log(`대기 시간: ${waitTime/1000}초`);
                    
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return getMusicRecommendations(emotion, retryCount + 1);
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.tracks && data.tracks[0]) {
                    setMusicRecommendations(prev => ({
                        ...prev,
                        [emotion]: data.tracks[0]
                    }));
                }
            } catch (error) {
                console.error('음악 추천 중 오류:', error);
                if (retryCount < 3) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return getMusicRecommendations(emotion, retryCount + 1);
                }
            }
        };

        // 순차적으로 API 요청 실행
        const fetchAllRecommendations = async () => {
            for (const emotion of analyzedEmotions) {
                // 이미 추천곡이 있는 경우 스킵
                if (!musicRecommendations[emotion]) {
                    await getMusicRecommendations(emotion);
                    // 각 요청 사이에 1초 간격
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        };

        if (analyzedEmotions.length > 0 && token) {
            fetchAllRecommendations();
        }
    }, [analyzedEmotions, token]);

    useEffect(() => {
        if (analyzedEmotions.length > 0 && musicRecommendations[analyzedEmotions[0]]) {
            setSelectedMusicId(musicRecommendations[analyzedEmotions[0]].id);
        }
    }, [analyzedEmotions, musicRecommendations]);

    const handleEmotionsChange = (newEmotions) => {
        setAnalyzedEmotions(newEmotions);
    };

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
                        <button 
                            className="plus-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <img src="/emotion_add_button.svg" alt="감정 추가" />
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
            <EmotionSelectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedEmotions={analyzedEmotions}
                onEmotionsChange={handleEmotionsChange}
            />
        </div>
    )
}

function EmotionMusicPage() {
    const location = useLocation();
    const [diaryText, setDiaryText] = useState(
        location.state?.diaryText || `오늘은 아침부터...` // 기본 텍스트는 fallback으로 사용
    );

    return (
        <div className="emotion-music-page">
            <Header/>
            <DiaryContent diaryText={diaryText}/>
            <Todays diaryText={diaryText} />

        </div>
    )
}

export default EmotionMusicPage