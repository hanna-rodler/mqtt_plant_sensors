import React, { useState } from 'react';
import StatusModal from "./StatusModal";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const PlantCard = ({ plant, isBest, onStatusChange }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handlePencilClick = () => setShowModal(true);
    const handleCancel = () => setShowModal(false);
    const handleConfirm = (newStatus) => {
        onStatusChange(newStatus);
        setShowModal(false);
    };

    return (
        <>
            <div className="plant-card">
                <img src={plant.image} alt={plant.name} className="plant-card-image" />
                <div className="plant-card-data">
                    <h2 onClick={() => navigate(`/plant/${plant.id}`)} className="plantName">{plant.name}</h2>
                    <p className="plant-card-data-details"><strong>Moisture:</strong> {plant.moisture}</p>
                    <p className="plant-card-data-details"><strong>Humidity:</strong> {plant.humidity}</p>
                    <p className="plant-card-data-details"><strong>Light:</strong> {plant.light}</p>
                    <p className="plant-card-data-details"><strong>Temperature:</strong> {plant.temperature}°C</p>
                    <p className="plant-card-data-details">
                        <strong>Status:</strong> {plant.status}{" "}
                        <img
                            src={`/images/pencil_green.svg`}
                            className="plant-card-pencil"
                            onClick={handlePencilClick}
                        />
                    </p>
                    <p className="plant-card-data-details"><strong>Score:</strong> {plant.score}/100</p>
                </div>
                {isBest && (
                    <img
                        src="/images/orden.svg"
                        alt="Best Plant Badge"
                        className="plant-card-badge"
                    />
                )}
                <img
                    src={`/images/${plant.status}.svg`}
                    className="plant-card-status-image"
                    alt="plant status visual"
                />
            </div>

            <StatusModal
                show={showModal}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
};

export default PlantCard;
