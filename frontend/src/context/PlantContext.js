import { createContext, useState } from "react";

const PlantContext = createContext();

const initialPlants = [
  {
    id: "plant1",
    name: "Plant 1",
    moisture: 300,
    humidity: 400,
    light: 450,
    temperature: 23,
    status: "critical",
    score: 60,
    image: "/images/plant1.jpg",
  },
  {
    id: "device1",
    name: "Plant 2",
    moisture: 600,
    humidity: 300,
    light: 700,
    temperature: 22,
    status: "healthy",
    score: 92,
    image: "/images/plant2.jpeg",
  },
];

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState(initialPlants);

  const updatePlantStatus = (id, newStatus) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    // Optional: PATCH an API senden
  };

  return (
    <PlantContext.Provider value={{ plants, updatePlantStatus }}>
      {children}
    </PlantContext.Provider>
  );
};

export default PlantContext;
