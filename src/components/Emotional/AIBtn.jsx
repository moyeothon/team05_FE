import React from 'react';
import './AIBtn.css';

const AIBtn = ({ text, onClick }) => {
    return (
        <button className="ai-button" onClick={onClick}>
            {text}
        </button>
    );
};

export default AIBtn;
