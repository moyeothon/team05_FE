import React from 'react';
import './Writing.css';
import Header from '../../components/Header'; // Corrected import

const Writing = () => {
  return ( 
    <div className='standard'>
      <Header/>

      <div>
        <textarea className='input-part'placeholder='오늘 하루는 어땠나요?'/>
      </div>
    </div>
  );
}

export default Writing;
