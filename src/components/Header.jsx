import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ diaryText, selectedDate, onNext, onComplete }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNext = () => {
    if (location.pathname === '/writing') {
      if (onNext()) {
        navigate('/emotion', { state: { diaryText, selectedDate } });
      }
    } else if (location.pathname === '/emotion') {
      onComplete && onComplete();
    }
  };

  const handleBack = () => {
    if (location.pathname === '/emotion') {
      navigate('/writing', { 
        state: { selectedDate }
      });
    } else if(location.pathname === '/writing'){
      navigate('/calendar');
    } else if(location.pathname === '/diary-detail'){
      navigate('/calendar');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-back">
          <span className="back" onClick={handleBack}>뒤로</span>
        </div>
        <div className="header-left">
          <span className="date">일기 쓰기</span>
        </div>
        <div className="header-right">
          {location.pathname === '/writing' && (
            <span className="next" onClick={handleNext}>다음</span>
          )}
          {location.pathname === '/emotion' && (
            <span className="next" onClick={handleNext}>완료</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
