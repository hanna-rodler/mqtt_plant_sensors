import { createContext, useEffect, useState } from "react";
import {
  fetchMoistureByDeviceId,
  fetchTemperatureByDeviceId,
  fetchLightByDeviceId,
  fetchHumidityByDeviceId,
  sendPlantStatus,
  fetchStatusByPlantId,
  fetchResultByPlantId,
} from "../api";

const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState([
    {
      id: "1",
      name: "Plant 1",
      deviceId: "device1",
      image: "/images/plant1.jpg",
    },
    {
      id: "2",
      name: "Plant 2",
      deviceId: "plant2",
      image: "/images/plant2.jpeg",
    },
    {
      id: "3",
      name: "Plant 3",
      deviceId: "plant1",
      image: "/images/plant2.jpeg",
    },
  ]);

  const fetchSensorData = async () => {
    const updated = await Promise.all(
      plants.map(async (plant) => {
        const plantId = "plant" + plant.id;
        try {
          const [moisture, temperature, light, humidity, status, score] =
            await Promise.all([
              fetchMoistureByDeviceId(plant.deviceId),
              fetchTemperatureByDeviceId(plant.deviceId),
              fetchLightByDeviceId(plant.deviceId),
              fetchHumidityByDeviceId(plant.deviceId),
              fetchStatusByPlantId(plantId),
              fetchResultByPlantId(plantId),
            ]);

          return {
            ...plant,
            moisture: moisture[0]?.moisture ?? null,
            temperature: temperature[0]?.temperature ?? null,
            light: light[0]?.light ?? null,
            humidity: humidity[0]?.humidity ?? null,
            status: status[0]?.status ?? null,
            score: score[0]?.score ?? null,
          };
        } catch (error) {
          console.error(`Fehler bei ${plant.name}:`, error);
          return plant;
        }
      })
    );

    setPlants(updated);
  };

  useEffect(() => {
    fetchSensorData();
  }, []);

  const updatePlantStatus = async (id, newStatus) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    const plant = plants.find((p) => p.id === id);
    if (!plant) return;

    const plantId = "plant" + plant.id;

    try {
      await sendPlantStatus(plantId, newStatus);
    } catch (err) {
      console.error("Error sending to DB:", err);
    }
  };

  return (
    <PlantContext.Provider value={{ plants, updatePlantStatus }}>
      {children}
    </PlantContext.Provider>
  );
};

export default PlantContext;
