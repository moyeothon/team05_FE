import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <span className="date">10월 29일 화요일 ▼</span>
        </div>
        <div className="header-right">
          <span className="next">다음</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
