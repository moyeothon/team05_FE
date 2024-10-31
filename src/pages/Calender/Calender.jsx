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

    return (
        <div className='standard'>
            <div className='calendar-header-part'>
                <div className='calendar-text-part'>Calendar</div>
                <div className='calendar-search-part'><IoIosSearch /></div>
            </div>

            <div className='calendar-part'>
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

                        if (activeDate === formattedDate) {
                            return (dayOfWeek === 0) ? 'sunday active' : (dayOfWeek === 6) ? 'saturday active' : '';
                        }

                        return (dayOfWeek === 0) ? 'sunday' : (dayOfWeek === 6) ? 'saturday' : '';
                    }}
                />
            </div>

            <div className='line'></div>

            <div className='music-recommend-part'>
                <div className="tags">
                    <div className="emotion-tag">#행복</div>
                    <div className="emotion-tag">#설렘</div>
                    <div className="emotion-tag">#기쁨</div>
                </div>


                <div className='diary-text'>
                    오늘은 아침부터 부쩍 차가워진 공기에 몸이 움츠러들었지만, 하늘이 맑아서...
                </div>  
                <div className='music-part'>
                    <div className='music-part-flex'>
                        <div className='music-part-img1'>
                            <img src="#" alt="" />
                        </div>
                        <div className='music-title-text'>
                            <span style={{fontSize: 18}}>노래제목</span> <br />
                            <span style={{color: '#3C3C43', fontSize: 15}}>가수명</span>
                        </div>
                        <div className='music-playbut'>
                            <img src={playbutton} alt="" style={{width: 17}} />
                        </div>
                    </div>
                </div>
                <div className='diary-date text-gray-500 mt-4'>
                    {moment(value).format("YYYY년 MM월 DD일")}
                </div>
            </div>

            <button className='plusbutton'>
                <div style={{cursor: 'pointer'}}>
                    +
                </div>
            </button>
        </div>
    );
}

export default Calender;
