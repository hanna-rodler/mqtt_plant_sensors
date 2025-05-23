const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// single value
export const fetchMoistureByDeviceId = async (deviceId) => {
  const res = await fetch(`${BASE_URL}/sensors/moisture/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch moisture");
  return res.json();
};

export const fetchTemperatureByDeviceId = async (deviceId) => {
  const res = await fetch(`${BASE_URL}/sensors/temperature/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch temperature");
  return res.json();
};

export const fetchLightByDeviceId = async (deviceId) => {
  const res = await fetch(`${BASE_URL}/sensors/light/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch light");
  return res.json();
};

export const fetchHumidityByDeviceId = async (deviceId) => {
  const res = await fetch(`${BASE_URL}/sensors/humidity/${deviceId}`);
  if (!res.ok) throw new Error("Failed to fetch temperature");
  return res.json();
};

// status
export const sendPlantStatus = async (plantId, status) => {
  const response = await fetch(`${BASE_URL}/plants/${plantId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Speichern des Status");
  }

  return response.json();
};

export const fetchStatusByPlantId = async (plantId) => {
  const res = await fetch(`${BASE_URL}/plants/${plantId}/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
};

export const fetchResultByPlantId = async (plantId) => {
  const res = await fetch(`${BASE_URL}/plants/${plantId}/result`);
  if (!res.ok) throw new Error("Failed to fetch result");
  return res.json();
};
