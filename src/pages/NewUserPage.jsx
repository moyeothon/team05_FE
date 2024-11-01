import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UserPage.css';
import axios from 'axios';

const NewUserPage = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      try {
        // 백엔드로 닉네임 등록 요청
        await axios.post('https://junyeongan.store/api/member', {
          nickname: nickname.trim()
        });
        
        // 성공 시 로컬스토리지에 저장하고 페이지 이동
        localStorage.setItem('userNickname', nickname.trim());
        navigate('/calendar');
      } catch (error) {
        // 중복 닉네임 에러 처리
        if (error.response?.status === 400) {
          toast.error('중복된 닉네임입니다. 다른 닉네임을 입력해주세요.');
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