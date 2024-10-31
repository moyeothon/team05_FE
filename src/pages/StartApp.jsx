import React from 'react';
import './Start.css';
import logo from '../../src/assets/logo.png'

const Start = () => {
  return (
    <div className='start-container'>
      <div className='start-content'>
        <div className='start-text'>
          닉네임을 입력하여 <br />
          <span>Mute</span>와 함께 하루를 기록해요!
          <div className='start-marking'></div>
        </div>

        <div className='img-part'>
          <img src={logo} alt="로고" />
        </div>

        <input
          type='text' 
          className='nickname-part' 
          placeholder='닉네임 입력'
        />
      </div>
    </div>
  );
};

export default Start;
