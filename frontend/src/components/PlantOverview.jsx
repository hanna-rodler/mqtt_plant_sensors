import React from 'react';
import PlantCard from './PlantCard';
import '../App.css';

const PlantOverview = ({ plants, updateStatus }) => {
    const bestScore = Math.max(...plants.map(p => p.score));

    return (
        <div className="plant-overview-container">
            {plants.map((plant) => (
                <PlantCard
                    key={plant.id}
                    plant={plant}
                    isBest={plant.score === bestScore}
                    onStatusChange={(newStatus) => updateStatus(plant.id, newStatus)}
                />
            ))}
        </div>
    );
};

export default PlantOverview;
