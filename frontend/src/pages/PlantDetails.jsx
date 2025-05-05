import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import PlantContext from '../context/PlantContext';
import PlantCardBig from '../components/PlantCardBig';
import HistoryChart from "../components/HistoryChart";
import '../App.css';

const exampleDataMoisture = [
    { timestamp: '10:00', moisture: 450 },
    { timestamp: '11:00', moisture: 470 },
    { timestamp: '12:00', moisture: 430 },
    { timestamp: '13:00', moisture: 420 },
];

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
                <HistoryChart title="Moisture History" data={exampleDataMoisture} dataKey="moisture" />
                <HistoryChart title="Humidity History" data={exampleDataMoisture} dataKey="moisture" />
                <HistoryChart title="Light History" data={exampleDataMoisture} dataKey="moisture" />
                <HistoryChart title="Temperature History" data={exampleDataMoisture} dataKey="moisture" />
                <HistoryChart title="Status History" data={exampleDataMoisture} dataKey="moisture" />
                <HistoryChart title="Score History" data={exampleDataMoisture} dataKey="moisture" />
            </div>
        </div>
    );
};

export default PlantDetail;
