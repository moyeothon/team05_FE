import React, { useState } from 'react';
import './Writing.css';
import Header from '../../components/Header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Writing = () => {
  const [diaryText, setDiaryText] = useState('');

  const validateDiary = () => {
    if (!diaryText.trim()) {
      toast.error('일기 내용을 적어주세요!');
      return false;
    }

    const lines = diaryText.trim().split('\n').filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
      toast.error('조금만 더 성의있는 일기를 적어주세요!');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateDiary()) {
      // 다음 페이지로 이동하는 로직
    }
  };

  return ( 
    <div className='writing-page'>
      <Header diaryText={diaryText} onNext={handleNext}/>
      <div className="writing-content-background">
        <div className="writing-content-box">
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
