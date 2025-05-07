import { useParams } from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import PlantContext from '../context/PlantContext';
import PlantCardBig from '../components/PlantCardBig';
import HistoryChart from "../components/HistoryChart";
import '../App.css';
import {fetchMoistureHistoryByDeviceId,
        fetchLightHistoryByDeviceId,
        fetchHumidityHistoryByDeviceId,
        fetchTemperatureHistoryByDeviceId} from "../api";


const PlantDetail = () => {
    const { id } = useParams();
    const { plants, updatePlantStatus } = useContext(PlantContext);

    const selectedPlant = plants.find((p) => p.id === id);

    if (!selectedPlant) return <p>Pflanze nicht gefunden.</p>;

    return (
        <div className="plant-detail-wrapper">
            <div className="plant-detail-content">
                <h1 className="plant-detail-heading">Watch your plant in detail 🕵️‍</h1>
                <PlantCardBig
                    plant={selectedPlant}
                    onStatusChange={(newStatus) => updatePlantStatus(id, newStatus)}
                />

                <HistoryChart title="Moisture History" endpointKey="moistures" dataKey="moisture" deviceId={selectedPlant.deviceId}/>
                <HistoryChart title="Humidity History" endpointKey="humidities" dataKey="humidity" deviceId={selectedPlant.deviceId}/>
                <HistoryChart title="Light History" endpointKey="lights" dataKey="light" deviceId={selectedPlant.deviceId}/>
                <HistoryChart title="Temperature History" endpointKey="temperatures" dataKey="temperature" deviceId={selectedPlant.deviceId}/>
            </div>
        </div>
    );
};

export default PlantDetail;
