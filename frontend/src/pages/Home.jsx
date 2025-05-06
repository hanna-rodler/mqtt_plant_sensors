import React, { useContext } from 'react';
import PlantOverview from "../components/PlantOverview";
import PlantContext from '../context/PlantContext';
import '../App.css';

const Home = () => {
    const { plants, updatePlantStatus } = useContext(PlantContext);

    return (
        <div className="home-container">
            <h1 className="home-heading">Welcome to Smart Plants 🌱</h1>
            <p className="home-text">
                Monitor your plants easily with real-time sensor data!
            </p>
            <div>
                <PlantOverview
                    plants={plants}
                    updateStatus={updatePlantStatus}
                />
            </div>
        </div>
    );
};

export default Home;
