import React from 'react'
import './Calender.css'
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IoIosSearch } from "react-icons/io";
import playbutton from '../../assets/playbutton.png';

const Calender = () => {
  return (
    <div className='standard'>
        <div className='calendar-header-part'>
            <div className='calendar-text-part'>Calendar</div>
            <div className='calendar-search-part'><IoIosSearch /></div>
        </div>
        

        <div className='calendar-part'>
            <Calendar/>
        </div>

        <div className='line'></div>

        <div className='music-recommend-part'>
            <div className="tags">
                <div className="emotion-tag">행복</div>
                <div className="emotion-tag">설렘</div>
                <div className="emotion-tag">기쁨</div>
            </div>
            <div className='music-part'>
                <div className='music-part-flex'>
                    <div className='music-part-img1'>
                        <img src="#" alt="" />
                    </div>
                    <div className='music-title-text'>
                        <span style={{fontSize: 18}}>노래제목</span> <br/>
                        <span style={{color: '#3C3C43', fontSize: 15}}>가수명</span>
                    </div>
                    <div className='music-playbut'>
                        <img src={playbutton} alt=""  style={{width: 17}}/>
                    </div>
                </div>
            </div>
            <div className='diary-text'>
                오늘은 아침부터 부쩍 차가워진 공기에 몸이 움츠러들었지만, 하늘이 맑아서...
            </div>
            <div className='diary-date'>
                10월 29일 화요일
            </div>
        </div>

        <button className='plusbutton'>
            <div style={{cursor: 'pointer'}}>
            +
            </div>
        </button>
    </div>
  )
}

export default Calender