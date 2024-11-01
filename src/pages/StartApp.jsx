import React from 'react';
import './Start.css';
import logo from '../../src/assets/logo.png'
import { useNavigate } from 'react-router-dom';

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className='start-container'>
      <div className='start-content'>
        <div className='start-text'>
          <span>Mute</span>와 함께<br />
          하루를 기록해보세요
          <div className='start-marking'></div>
        </div>

        <div className='img-part'>
          <img src='/Logo.svg' alt="로고" />
        </div>

        <div className='button-container'>
          <button 
            className='start-new-btn'
            onClick={() => navigate('/new-user')}
          >
            새로 시작하기
          </button>
          
          <div className='existing-user'>
            <button 
              className='start-existing-btn'
              onClick={() => navigate('/existing-user')}
            >
              이미 기록중이신가요?
            </button>
            <span className='helper-text'>
              기존 기록을 이어서 작성하실 수 있어요
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
