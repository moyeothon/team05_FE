import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';

const NewUserPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      // 여기에 닉네임 저장 로직 추가
      navigate('/calendar'); // 캘린더 페이지로 이동
    }
  };

  return (
    <div className='user-container'>
      <div className='user-content'>
      <div className='img-part-2'>
          <img src='/Logo.svg' alt="로고" />
        </div>
        <div className='user-text'>
          <span>환영합니다!</span><br />
          사용하실 닉네임을 입력해주세요
        </div>

        <form onSubmit={handleSubmit} className='nickname-form'>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className='nickname-input'
            maxLength={10}
          />
          <button 
            type="submit" 
            className='complete-btn'
            disabled={!nickname.trim()}
          >
            완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUserPage; 