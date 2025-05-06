import React, { useState } from 'react';
import '../App.css';
import ProgressBar from "./ProgressBar";
import StatusModal from "./StatusModal";

const PlantCardBig = ({ plant, onStatusChange }) => {
    const [showModal, setShowModal] = useState(false);

    const handlePencilClick = () => setShowModal(true);
    const handleCancel = () => setShowModal(false);

    const handleConfirm = (newStatus) => {
        onStatusChange && onStatusChange(newStatus);
        setShowModal(false);
    };

    return (
        <>
            <div className="plant-card-big">
                <img src={plant.image} alt={plant.name} className="plant-card-big-image" />
                <div className="plant-card-big-data">
                    <h2>{plant.name} - Current State</h2>

                    <p className="plant-card-big-details">
                        <strong>Moisture:</strong> {plant.moisture} {getIcon(plant.moisture, 400, 700)} ({moistureStatus(plant.moisture)}) |
                        Optimal Range: 400–700
                    </p>

                    <p className="plant-card-big-details">
                        <strong>Humidity:</strong> {plant.humidity} {getIcon(plant.humidity, 300, 600)} ({humidityStatus(plant.humidity)}) |
                        Optimal Range: 300–600
                    </p>

                    <p className="plant-card-big-details">
                        <strong>Light:</strong> {plant.light} {getIcon(plant.light, 600, 900)} ({lightStatus(plant.light)}) |
                        Optimal Range: 600–900
                    </p>

                    <p className="plant-card-big-details">
                        <strong>Temperature:</strong> {plant.temperature}°C {getIcon(plant.temperature, 20, 27)} ({tempStatus(plant.temperature)}) |
                        Optimal Range: 20–27 °C
                    </p>

                    <p className="plant-card-big-details">
                        <strong>Status:</strong> {plant.status} –{" "}
                        {plant.status === 'healthy' && "All good! 🌿"}
                        {plant.status === 'moderate' && "Needs your attention soon."}
                        {plant.status === 'critical' && "Immediate action required! ⚠️"}
                        <img
                            src={`/images/pencil_green.svg`}
                            className="plant-card-big-pencil"
                            onClick={handlePencilClick}
                        />
                    </p>

                    <p className="plant-card-big-details">
                        <strong>Score:</strong>
                        <ProgressBar
                            value={plant.score}
                            max={100}
                            color={
                                plant.status === 'critical' ? '#e74c3c' :
                                    plant.status === 'moderate' ? '#f1c40f' :
                                        '#76c442'
                            }
                        />
                    </p>
                </div>

                <img
                    src={`/images/${plant.status}.svg`}
                    alt="plant visual"
                    className="plant-card-big-status-image"
                />
            </div>

            {showModal && (
                <StatusModal
                    show={showModal}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
};

const getIcon = (value, min, max) => {
    if (value < min) return '🔴';
    if (value > max) return '🔴';
    return '🟢';
};

const moistureStatus = (v) => v < 400 ? "Too dry" : v > 700 ? "Too wet" : "Ideal";
const humidityStatus = (v) => v < 300 ? "Too dry" : v > 600 ? "Too wet" : "Ideal";
const lightStatus = (v) => v < 600 ? "Too dark" : v > 900 ? "Too bright" : "Acceptable";
const tempStatus = (v) => v < 20 ? "Too cold" : v > 27 ? "Too hot" : "Ideal";

export default PlantCardBig;
