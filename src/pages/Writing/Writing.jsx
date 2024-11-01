import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Writing.css';
import Header from '../../components/Header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const Writing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.selectedDate || moment().format("YYYY-MM-DD");
  const [diaryText, setDiaryText] = useState('');

  const validateDiary = () => {
    if (!diaryText.trim()) {
      toast.error('일기 내용을 적어주세요!');
      return false;
    }

    const lines = diaryText.trim().split('\n').filter(line => line.trim().length > 0);
    const totalCharacters = lines.join('').length;

    if (lines.length < 1 || totalCharacters < 10) {
      toast.error('조금만 더 성의있는 일기를 적어주세요!');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateDiary()) {
      navigate('/emotion', {
        state: { 
          diaryText, 
          selectedDate 
        }
      });
      return true;
    }
    return false;
  };

  return ( 
    <div className='writing-page'>
      <Header 
        diaryText={diaryText} 
        selectedDate={selectedDate} 
        onNext={handleNext}
      />
      <div className="writing-content-background">
        <div className="writing-content-box">
          <div className="selected-date">
            {moment(selectedDate).format("YYYY년 MM월 DD일")}
          </div>
          <textarea 
            className='input-part'
            placeholder='오늘 하루는 어땠나요?'
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Writing;