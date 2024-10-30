import Header from "../../components/Header"
import AIBtn from "../../components/Emotional/AIBtn"

import "./EmotionMusicPage.css"

const DiaryContent = () => {
    return (
        <div className="diary-content-background">
            <div className="diary-content-box">
                <div className="diary-content">
                    <p>
                        오늘은 아침부터 왠지 모르게 설렘이 가득한 하루였다. 눈을 뜨자마자 창문으로 들어오는 햇살이 참 마스꺼워서 기분이 좋아졌고, 그 느낌을 담아 하루를 시작했다. 출근길에는 좋아하는 노래를 듣고, 간간히 스쳐가는 가을바람에 행복이 묻어나는 듯했다.
                    </p>
                    <p>
                        점심때는 동료들과 한껏 웃으며 시간을 보냈다. 웃음소리가 사무실을 가득 채우는 순간들이 참 소중하다는 걸 느꼈다. 오후 내내 마음이 기뻐고 가볍게 날아다니는 기분이 들었다.
                    </p>
                </div>
            </div>
        </div>
    )
}

const Todays = () => {
    return (
        <div className="todays-section">
            <div className="todays-content">
                <div className="todays-item">
                    <div className="todays-header">
                        <img src="/smile.svg" alt="감정 아이콘" />
                        <h2>오늘의 감정</h2>
                    </div>
                    <AIBtn text="AI로 추출" />
                </div>
                
                <div className="todays-item">
                    <div className="todays-header">
                        <img src="/music.svg" alt="음악 아이콘" />
                        <h2>오늘의 음악</h2>
                    </div>
                    <AIBtn text="감정 기반 AI 추천 음악" />
                </div>
            </div>
        </div>
    )
}

function EmotionMusicPage() {
    return (
        <div className="emotion-music-page">
            <Header/>
            <DiaryContent/>
            <Todays/>
        </div>
    )
}

export default EmotionMusicPage