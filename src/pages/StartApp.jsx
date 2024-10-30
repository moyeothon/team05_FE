import React from 'react';
import './Start.css';

const Start = () => {
  return (
    <div className='standard'>
      <div className='start-text'>
        닉네임을 입력하여 <br />
        MUTE와 함께 하루를 기록해요!
      </div>

      <div className='img-part'>
        <img src="#" alt="" />
      </div>

      <input
        type='text' className='nickname-part' placeholder='닉네임 입력'/>
    </div>
  );
};

export default Start;
