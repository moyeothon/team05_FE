import React from 'react';
import './Writing.css';
import Header from '../../components/Header';

const Writing = () => {
  return ( 
    <div className='writing-page'>
      <Header/>
      <div className="writing-content-background">
        <div className="writing-content-box">
          <textarea 
            className='input-part'
            placeholder='오늘 하루는 어땠나요?'
          />
        </div>
      </div>
    </div>
  );
}

export default Writing;
