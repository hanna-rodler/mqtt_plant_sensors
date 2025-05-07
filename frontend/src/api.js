const BASE_URL = 'http://localhost:3001/api/sensors';


// single value
export const fetchMoistureByDeviceId = async (deviceId) => {
    const res = await fetch(`${BASE_URL}/moisture/${deviceId}`);
    if (!res.ok) throw new Error("Failed to fetch moisture");
    return res.json();
};

export const fetchTemperatureByDeviceId = async (deviceId) => {
    const res = await fetch(`${BASE_URL}/temperature/${deviceId}`);
    if (!res.ok) throw new Error("Failed to fetch temperature");
    return res.json();
};

export const fetchLightByDeviceId = async (deviceId) => {
    const res = await fetch(`${BASE_URL}/light/${deviceId}`);
    if (!res.ok) throw new Error("Failed to fetch light");
    return res.json();
};

export const fetchHumidityByDeviceId = async (deviceId) => {
    const res = await fetch(`${BASE_URL}/humidity/${deviceId}`);
    if (!res.ok) throw new Error("Failed to fetch temperature");
    return res.json();
};

// history
export async function fetchMoistureHistoryByDeviceId(deviceId) {
    const response = await fetch(`${BASE_URL}/moistures/${deviceId}`);
    const data = await response.json();
    return data;
}

export async function fetchTemperatureHistoryByDeviceId(deviceId) {
    const response = await fetch(`${BASE_URL}/temperatures/${deviceId}`);
    const data = await response.json();
    return data;
}

export async function fetchLightHistoryByDeviceId(deviceId) {
    const response = await fetch(`${BASE_URL}/lights/${deviceId}`);
    const data = await response.json();
    return data;
}

export async function fetchHumidityHistoryByDeviceId(deviceId) {
    const response = await fetch(`${BASE_URL}/humidities/${deviceId}`);
    const data = await response.json();
    return data;
}


// status
export const sendPlantStatus = async (plantId, status) => {
    const response = await fetch(`http://localhost:3001/api/plants/${plantId}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Speichern des Status');
    }

    return response.json();
};

export const fetchStatusByPlantId = async (plantId) => {
    const res = await fetch(`http://localhost:3001/api/plants/${plantId}/status`);
    if (!res.ok) throw new Error("Failed to fetch status");
    return res.json();
};

export const fetchResultByPlantId = async (plantId) => {
    const res = await fetch(`http://localhost:3001/api/plants/${plantId}/result`);
    if (!res.ok) throw new Error("Failed to fetch result");
    return res.json();
};