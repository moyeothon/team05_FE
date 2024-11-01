import { useState, useEffect, useRef } from "react"
import Header from "../../components/Header"
import AIBtn from "../../components/Emotional/AIBtn"
import axios from 'axios';
import emotions from '../../assets/emotions.json';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicItem from '../../components/Music/MusicItem';
import "./EmotionMusicPage.css"

const DiaryContent = ({ diaryText }) => {
    return (
        <div className="diary-content-background">
            <div className="diary-content-box">
                <div className="diary-emotion-content">
                    <p>{diaryText}</p>
                </div>
            </div>
        </div>
    )
}

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

const Todays = ({ diaryText, selectedDate, savingState, setSavingState }) => {
    const { analyzedEmotions, musicRecommendations, selectedMusicId, isSaving } = savingState;

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});

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
            setSavingState(prev => ({
                ...prev,
                analyzedEmotions: detectedEmotions.filter(emotion => emotions[emotion]).slice(0, 3)
            }));
            
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
            setSavingState(prev => ({
                ...prev,
                token: data.access_token
            }));
        };
        getSpotifyToken();
    }, []);

    useEffect(() => {
        const getMusicRecommendations = async (emotion, retryCount = 0) => {
            if (!savingState.token || !emotions[emotion]) return;

            setLoadingStates(prev => ({
                ...prev,
                [emotion]: true
            }));
            
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
                            'Authorization': `Bearer ${savingState.token}`,
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
                    console.log(`음악 추천 데이터 (${emotion}):`, data.tracks[0]);
                    setSavingState(prev => ({
                        ...prev,
                        musicRecommendations: {
                            ...prev.musicRecommendations,
                            [emotion]: data.tracks[0]
                        }
                    }));
                }
            } catch (error) {
                console.error('음악 추천 중 오류:', error);
                if (retryCount < 3) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return getMusicRecommendations(emotion, retryCount + 1);
                }
            } finally {
                setLoadingStates(prev => ({
                    ...prev,
                    [emotion]: false
                }));
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

        if (analyzedEmotions.length > 0 && savingState.token) {
            fetchAllRecommendations();
        }
    }, [analyzedEmotions, savingState.token]);

    // 전체 musicRecommendations 상태 변화 확인을 위한 useEffect 추가
    useEffect(() => {
        console.log('현재 musicRecommendations 상태:', musicRecommendations);
    }, [musicRecommendations]);

    useEffect(() => {
        if (analyzedEmotions.length > 0 && musicRecommendations[analyzedEmotions[0]]) {
            setSavingState(prev => ({
                ...prev,
                selectedMusicId: musicRecommendations[analyzedEmotions[0]].id
            }));
        }
    }, [analyzedEmotions, musicRecommendations]);

    const handleEmotionsChange = (newEmotions) => {
        setSavingState(prev => ({
            ...prev,
            analyzedEmotions: newEmotions
        }));
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
                                    {loadingStates[emotion] ? (
                                        <div className="loading-music">
                                            <div className="loading-spinner"></div>
                                            <p className="loading-text">음악 추천 중...</p>
                                        </div>
                                    ) : (
                                        musicRecommendations[emotion] && 
                                        <MusicItem 
                                            track={musicRecommendations[emotion]}
                                            isSelected={selectedMusicId === musicRecommendations[emotion].id}
                                            onSelect={() => setSavingState(prev => ({
                                                ...prev,
                                                selectedMusicId: musicRecommendations[emotion].id
                                            }))}
                                        />
                                    )}
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
    const navigate = useNavigate();
    const { diaryText, selectedDate } = location.state || {};
    const [savingState, setSavingState] = useState({
        isSaving: false,
        analyzedEmotions: [],
        selectedMusicId: null,
        musicRecommendations: {}
    });

    const handleComplete = async () => {
        if (!savingState.selectedMusicId) {
            alert('음악을 선택해주세요!');
            return;
        }

        setSavingState(prev => ({ ...prev, isSaving: true }));
        const nickname = localStorage.getItem('userNickname');

        // 선택된 음악 기
        const selectedEmotion = savingState.analyzedEmotions.find(emotion => 
            savingState.musicRecommendations[emotion]?.id === savingState.selectedMusicId
        );
        const selectedMusic = savingState.musicRecommendations[selectedEmotion];

        // 날짜 형식 변환 (YYYY-MM-DD)
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

        const diaryData = {
            nickname,
            content: diaryText,
            createDate: formattedDate,
            musicList: [{
                title: selectedMusic.name,
                artist: selectedMusic.artists[0].name,
                previewUrl: selectedMusic.preview_url || "",  // null인 경우 빈 문자열로
                imagePath: selectedMusic.album.images[0].url,
                emotionType: selectedEmotion
            }],
            emotionTypes: savingState.analyzedEmotions
        };

        try {
            console.log('Sending diary data:', diaryData); // 요청 데이터 확인
            const response = await axios.post('https://junyeongan.store/api/diary/create', diaryData);
            if (response.status === 200) {
                navigate('/calendar');
            }
        } catch (error) {
            console.error('일기 저장 중 오류:', error);
            console.error('에러 응답:', error.response?.data); // 서버 에러 응답 확인
            alert('일기 저장에 실패했습니다.');
        } finally {
            setSavingState(prev => ({ ...prev, isSaving: false }));
        }
    };

    return (
        <div className="emotion-music-page">
            <Header 
                diaryText={diaryText} 
                selectedDate={selectedDate}
                onComplete={handleComplete}
            />
            <DiaryContent diaryText={diaryText}/>
            <Todays 
                diaryText={diaryText} 
                selectedDate={selectedDate}
                savingState={savingState}
                setSavingState={setSavingState}
            />
        </div>
    );
}

export default EmotionMusicPage