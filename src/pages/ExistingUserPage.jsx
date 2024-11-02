import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UserPage.css';

const ExistingUserPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      try {
        // 사용자 조회
        const response = await axios.post(`https://junyeongan.store/api/diary?userNickname=${nickname.trim()}`);
        
        // 사용자가 이미 존재하는 경우 캘린더로 이동
        if ((response.status === 400 && 
             response.data?.details === "MEMBER_ALREADY_EXISTS")) {
          localStorage.setItem('userNickname', nickname.trim());
          navigate('/calendar');
        }
      } catch (error) {
        // 사용자 조회 실패 시
        if (error.response?.status === 404 && 
            error.response?.data?.details === "MEMBER_DOES_NOT_EXISTS") {
          toast.error('존재하지 않는 닉네임입니다. 다시 확인해주세요.');
        } else {
          toast.error('오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
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