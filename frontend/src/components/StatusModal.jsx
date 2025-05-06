import React, { useState } from 'react';
import '../App.css';

const statuses = ['healthy', 'moderate', 'critical'];

const StatusModal = ({ show, onConfirm, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = useState(null);

    if (!show) return null;

    const handleConfirm = () => {
        if (selectedStatus) {
            onConfirm(selectedStatus);
            setSelectedStatus(null);
        }
    };

    const handleSelect = (status) => {
        setSelectedStatus(status);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>How is your plant doing?</h2>
                <p>Please select the current condition of the plant based on its appearance.</p>
                <div className="status-container">
                    {statuses.map((status) => (
                        <div
                            key={status}
                            onClick={() => handleSelect(status)}
                            className={`status-option ${selectedStatus === status ? 'selected' : ''}`}
                        >
                            <img
                                src={`/images/${status}.svg`}
                                className="status-icon"
                                alt={status}
                            />
                            <p>{status}</p>
                        </div>
                    ))}
                </div>
                <div className="modal-actions">
                    <button className="modal-button" onClick={onCancel}>Abbrechen</button>
                    <button className="modal-button" onClick={handleConfirm} disabled={!selectedStatus}>
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
