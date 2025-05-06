import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import PlantContext from '../context/PlantContext';
import PlantCardBig from '../components/PlantCardBig';
import HistoryChart from "../components/HistoryChart";
import '../App.css';

const exampleDataMoisture = [
    // Last week
    { timestamp: '2025-04-28T12:00:00', moisture: 470 },
    { timestamp: '2025-04-29T12:00:00', moisture: 460 },
    { timestamp: '2025-04-30T12:00:00', moisture: 450 },
    { timestamp: '2025-05-01T12:00:00', moisture: 440 },
    { timestamp: '2025-05-02T12:00:00', moisture: 430 },
    { timestamp: '2025-05-03T12:00:00', moisture: 420 },
    { timestamp: '2025-05-04T12:00:00', moisture: 410 },

    // This week (today is assumed to be 2025-05-05)
    { timestamp: '2025-05-05T08:00:00', moisture: 430 },
    { timestamp: '2025-05-05T09:00:00', moisture: 450 },
    { timestamp: '2025-05-05T10:00:00', moisture: 400 },
    { timestamp: '2025-05-05T11:00:00', moisture: 420 },
    { timestamp: '2025-05-05T12:00:00', moisture: 440 },

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
                <HistoryChart title="Moisture History" data={exampleDataMoisture} dataKey="moistures" />
                <HistoryChart title="Humidity History" data={exampleDataMoisture} dataKey="humidities" />
                <HistoryChart title="Light History" data={exampleDataMoisture} dataKey="lights" />
                <HistoryChart title="Temperature History" data={exampleDataMoisture} dataKey="temperatures" />
                <HistoryChart title="Status History" data={exampleDataMoisture} dataKey="moisture" />
                <HistoryChart title="Score History" data={exampleDataMoisture} dataKey="moisture" />
            </div>
        </div>
    );
};

export default PlantDetail;
