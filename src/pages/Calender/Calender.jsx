import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calender.css';
import Calendar from "react-calendar";
import moment from 'moment';
import "react-calendar/dist/Calendar.css";
import { IoIosSearch } from "react-icons/io";
import playbutton from '../../assets/playbutton.png';
import DiarySection from '../../components/DiarySection/DiarySection';
import { diaryData } from '../../dummyData/diaryData';

const Calender = () => {
    const navigate = useNavigate();
    const [value, onChange] = useState(new Date());
    const [activeDate, setActiveDate] = useState(null);

    // 실제 일기 데이터가 있는 날짜 확인
    const hasSchedule = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        return diaryData.some(diary => 
            moment(diary.createAt).format("YYYY-MM-DD") === formattedDate
        );
    };

    const handleTileClick = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setActiveDate(activeDate === formattedDate ? null : formattedDate);
    };

    // 선택된 날짜의 일기 데이터 찾기
    const getSelectedDayDiaries = () => {
        const formattedValue = moment(value).format("YYYY-MM-DD");
        return diaryData.filter(diary => 
            moment(diary.createAt).format("YYYY-MM-DD") === formattedValue
        );
    };

    const selectedDiaries = getSelectedDayDiaries();

    // 글쓰기 페이지로 이동하는 함수
    const handleWritingClick = () => {
        navigate('/writing', {
            state: { selectedDate: moment(value).format("YYYY-MM-DD") }
        });
    };

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <div className='calendar-container'>
            <div className='calendar-content'>
                <div className='calendar-header'>
                    <h2>MUTE</h2>
                    <button className='search-button' onClick={handleSearchClick}>
                        <IoIosSearch />
                    </button>
                </div>
                <div className='hello-text'>장재혁님, 오늘의 감정을 음악과 함께 담아보세요!</div>
                <div className='calendar-section'>
                    <Calendar 
                        onChange={onChange} 
                        value={value} 
                        onClickDay={handleTileClick}
                        formatDay={(locale, date) => moment(date).format("D")}
                        tileContent={({ date }) => (
                            hasSchedule(date) ? <div className="dot"></div> : null
                        )}
                        tileClassName={({ date }) => {
                            const dayOfWeek = date.getDay();
                            const formattedDate = moment(date).format("YYYY-MM-DD");
                            return `calendar-tile ${
                                dayOfWeek === 0 ? 'sunday' : 
                                dayOfWeek === 6 ? 'saturday' : ''
                            } ${activeDate === formattedDate ? 'active' : ''}`;
                        }}
                        onDrillDown={null}
                        showNeighboringMonth={false}
                    />
                </div>

                {selectedDiaries.length > 0 ? (
                    selectedDiaries.map((diary, index) => (
                        <DiarySection 
                            key={index}
                            value={value} 
                            playbutton={playbutton}
                            diaryData={diary}
                        />
                    ))
                ) : (
                    <div className='no-diary-message' onClick={handleWritingClick}>
                        아직 일기가 없어요. 일기를 쓰러가볼까요?
                        <br/>
                        <span className="go-to-write">
                            일기 쓰러가기
                        </span>
                    </div>
                )}
            </div>

            <button className='plusbutton' onClick={handleWritingClick}>
                <img src="/Calender_add_icon.svg" alt="일기 추가" />
            </button>
        </div>
    );
}

export default Calender;