import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calender.css';
import Calendar from "react-calendar";
import moment from 'moment';
import "react-calendar/dist/Calendar.css";
import { IoIosSearch } from "react-icons/io";
import playbutton from '../../assets/playbutton.png';
import DiarySection from '../../components/DiarySection/DiarySection';
import axios from 'axios';

const Calender = () => {
    const navigate = useNavigate();
    const [value, onChange] = useState(new Date());
    const [activeDate, setActiveDate] = useState(null);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const userNickname = localStorage.getItem('userNickname') || '게스트';

    // API에서 일기 데이터 가져오기
    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await axios.get(`https://junyeongan.store/api/diary?userNickname=${userNickname}`);
                setDiaryEntries(response.data);
            } catch (error) {
                console.error('일기 데이터 불러오기 실패:', error);
            }
        };

        fetchDiaries();
    }, [userNickname]);

    // 일기 데이터가 있는 날짜 확인
    const hasSchedule = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        return diaryEntries.some(diary => 
            moment(diary.createDate).format("YYYY-MM-DD") === formattedDate
        );
    };

    const handleTileClick = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setActiveDate(activeDate === formattedDate ? null : formattedDate);
    };

    // 선택된 날짜의 일기 데이터 찾기
    const getSelectedDayDiaries = () => {
        const formattedValue = moment(value).format("YYYY-MM-DD");
        return diaryEntries.filter(diary => 
            moment(diary.createDate).format("YYYY-MM-DD") === formattedValue
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
                <div className='hello-text'>{userNickname}님, 오늘의 감정을 음악과 함께 담아보세요!</div>
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
                            diaryData={{
                                content: diary.content,
                                createAt: diary.createDate,
                                emotions: diary.emotionTypes,
                                music: diary.musicList[0] // 첫 번째 음악 정보 사용
                            }}
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