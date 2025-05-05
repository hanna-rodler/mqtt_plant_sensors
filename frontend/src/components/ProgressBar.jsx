import React from 'react';
import '../App.css';

const ProgressBar = ({ value, max = 100, color = '#76c442' }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className="progress-wrapper">
            <div className="progress-container">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
            <p className="progress-label">{`${Math.round(percentage)}%`}</p>
        </div>
    );
};

export default ProgressBar;
