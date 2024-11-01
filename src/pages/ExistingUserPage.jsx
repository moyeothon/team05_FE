import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';

const ExistingUserPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      // 여기에 닉네임 확인 및 검증 로직 추가
      navigate('/calendar');
    }
  };

  return (
    <div className='user-container'>
      <div className='user-content'>
        <div className='img-part-2'>
          <img src='/Logo.svg' alt="로고" />
        </div>

        <div className='user-text'>
          <span>다시 만나서 반가워요!</span><br />
          기존 닉네임을 입력해주세요
        </div>

        <form onSubmit={handleSubmit} className='nickname-form'>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="기존 닉네임을 입력해주세요"
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

export default ExistingUserPage;