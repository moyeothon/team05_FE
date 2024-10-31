import React, { useState } from 'react';
import './Calender.css';
import Calendar from "react-calendar";
import moment from 'moment';
import "react-calendar/dist/Calendar.css";
import { IoIosSearch } from "react-icons/io";
import playbutton from '../../assets/playbutton.png';

const Calender = () => {
    const [value, onChange] = useState(new Date());
    const [activeDate, setActiveDate] = useState(null);

    // 임의로 일정 있는 날짜 설정
    const hasSchedule = (date) => {
        const schedules = [
            '2024-10-01',
            '2024-10-15'
        ];
        return schedules.includes(moment(date).format("YYYY-MM-DD"));
    };

    const handleTileClick = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setActiveDate(activeDate === formattedDate ? null : formattedDate);
    };

    const tileContent = ({ date }) => {
        // 여기에 점을 표시할 날짜들의 배열을 정의하거나 API에서 가져옵니다
        const markedDates = ['2024-10-07', '2024-10-08', '2024-10-14', '2024-10-15', '2024-10-17', '2024-10-18', '2024-10-22', '2024-10-23', '2024-10-26', '2024-10-28', '2024-10-29'];
        
        // 날짜를 YYYY-MM-DD 형식으로 변환
        const dateString = date.toISOString().split('T')[0];
        
        // 해당 날짜가 markedDates 배열에 있으면 점을 표시
        if (markedDates.includes(dateString)) {
            return <div className="dot"></div>;
        }
        
        return null;
    };

    return (
        <div className='calendar-container'>
            <div className='calendar-content'>
                <div className='calendar-header'>
                    <h2>Calendar</h2>
                    <button className='search-button'>
                        <IoIosSearch />
                    </button>
                </div>

                <div className='calendar-section'>
                    <Calendar 
                        onChange={onChange} 
                        value={value} 
                        onClickDay={handleTileClick}
                        formatDay={(locale, date) => moment(date).format("D")}
                        tileContent={tileContent}
                        tileClassName={({ date }) => {
                            const dayOfWeek = date.getDay();
                            const formattedDate = moment(date).format("YYYY-MM-DD");
                            return `calendar-tile ${
                                dayOfWeek === 0 ? 'sunday' : 
                                dayOfWeek === 6 ? 'saturday' : ''
                            } ${activeDate === formattedDate ? 'active' : ''}`;
                        }}
                    />
                </div>

                <div className='diary-section'>
                    <div className="emotion-tags">
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
            </div>

            <button className='plusbutton'>
                <img src="/Calender_add_icon.svg" alt="일정 추가" />
            </button>
        </div>
    );
}

export default Calender;