import React, { useState } from 'react';
import './Calender.css';
import Calendar from "react-calendar";
import moment from 'moment';
import "react-calendar/dist/Calendar.css";
import { IoIosSearch } from "react-icons/io";
import playbutton from '../../assets/playbutton.png';
import DiarySection from '../../components/DiarySection/DiarySection';

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
                    />
                </div>

                <DiarySection value={value} playbutton={playbutton} />
                <DiarySection value={value} playbutton={playbutton} />
            </div>

            <button className='plusbutton'>
                <img src="/Calender_add_icon.svg" alt="일정 추가" />
            </button>
        </div>
    );
}

export default Calender;
