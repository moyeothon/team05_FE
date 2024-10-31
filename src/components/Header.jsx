import React from 'react';
import './Header.css';

const Header = ({ onNextClick }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <span className="date">10월 29일 화요일 ▼</span>
        </div>
        <div className="header-right">
          <span className="next" onClick={onNextClick}>다음</span> {/* "다음" 클릭 시 onNextClick 호출 */}
        </div>
      </div>
    </header>
  );
};

export default Header;
