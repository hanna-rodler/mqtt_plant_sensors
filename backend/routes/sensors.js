import express from "express";
import {
  LightSensorReading,
  MoistureSensorReading,
  TemperatureSensorReading,
  HumiditySensorReading,
} from "../db/mongo.js";
import {
  calcAverageLight,
  calcAverageTemperature,
  calcAverageMoisture,
  calcAverageHumidity,
  getLastWeekDates,
  getThisWeekDates,
} from "../utils/utils.js";

const router = express.Router();
// letzter Tag alle 5 min /day
// week: pro Stunde werte aggregieren
// month

// LIGHTS Sensor Readings -------------------------------------------------------
// GET last 100 light sensor readings from all plants
router.get("/lights", async (req, res) => {
  const data = await LightSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

// GET latest light sensor readings from a specific plant
router.get("/light/:deviceId", async (req, res) => {
  const data = await LightSensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(1);
  res.json(data);
});

// GET the most recent light sensor readings for deviceId
router.get("/lights/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  const data = await LightSensorReading.find({ device: deviceId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

// GET light sensor readings from the current day for a specific deviceId
router.get("/lights/:deviceId/today", async (req, res) => {
  const { deviceId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const data = await LightSensorReading.find({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ timestamp: -1 })
    .limit(200);
  res.json(data);
});

router.get("/lights/:deviceId/thisweek", async (req, res) => {
  const { deviceId } = req.params;

  const { firstWeekDay, daysInCurrentWeek } = getThisWeekDates();

  const weeklyAvgs = [];
  for (let day = 0; day < daysInCurrentWeek; day++) {
    // iterate through the days of the week
    const currentDay = new Date(firstWeekDay);
    currentDay.setDate(firstWeekDay.getDate() + day);
    const avgLight = await calcAverageLight(deviceId, currentDay);
    if (!avgLight.error) {
      weeklyAvgs.push(avgLight);
    }
  }

  res.json(weeklyAvgs);
});

router.get("/lights/:deviceId/lastweek", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const lastWeekStart = getLastWeekDates();

    const weeklyAvgs = [];
    for (let day = 0; day < 7; day++) {
      // iterate through the days of the week
      const currentDay = new Date(lastWeekStart);
      currentDay.setDate(lastWeekStart.getDate() + day);
      const avgLight = await calcAverageLight(deviceId, currentDay);
      if (!avgLight.error) {
        weeklyAvgs.push(avgLight);
      }
      // const avgLight =
    }

    res.json(weeklyAvgs);
  } catch (error) {
    console.error("Error fetching last week's light sensor readings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch last week's light sensor readings" });
  }
});

router.get("/lights/:deviceId/:day/average", async (req, res) => {
  // reject if req.params.day is not a valid date
  const { deviceId, day } = req.params;
  const avgLight = await calcAverageLight(deviceId, day);
  if (avgLight.error) {
    return res.status(avgLight.status).json({ error: avgLight.error });
  }
  res.json(avgLight);
});

// TEMPERATURE Sensor Readings -------------------------------------------------------
// GET all temperature sensor readings from all plants
router.get("/temperatures", async (req, res) => {
  const data = await TemperatureSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

// GET the most recent temperature sensor readings from a specific plant
router.get("/temperature/:deviceId", async (req, res) => {
  const data = await TemperatureSensorReading.find({
    device: req.params.deviceId,
  })
    .sort({ timestamp: -1 })
    .limit(1);
  res.json(data);
});

// GET latest temperature sensor readings from a specific plant
router.get("/temperatures/:deviceId", async (req, res) => {
  const data = await TemperatureSensorReading.find({
    device: req.params.deviceId,
  })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/temperatures/:deviceId/today", async (req, res) => {
  const { deviceId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const data = await TemperatureSensorReading.find({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: -1 });
  res.json(data);
});

router.get("/temperatures/:deviceId/:day/average", async (req, res) => {
  // reject if req.params.day is not a valid date
  const { deviceId, day } = req.params;
  const avgTemp = await calcAverageTemperature(deviceId, day);
  if (avgTemp.error) {
    return res.status(avgTemp.status).json({ error: avgTemp.error });
  }
  res.json(avgTemp);
});

router.get("/temperatures/:deviceId/thisweek", async (req, res) => {
  const { deviceId } = req.params;

  const { firstWeekDay, daysInCurrentWeek } = getThisWeekDates();

  const weeklyAvgs = [];
  for (let day = 0; day < daysInCurrentWeek; day++) {
    // iterate through the days of the week
    const currentDay = new Date(firstWeekDay);
    currentDay.setDate(firstWeekDay.getDate() + day);
    const avgTemperature = await calcAverageTemperature(deviceId, currentDay);
    if (!avgTemperature.error) {
      weeklyAvgs.push(avgTemperature);
    }
  }

  res.json(weeklyAvgs);
});

router.get("/temperatures/:deviceId/lastweek", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const lastWeekStart = getLastWeekDates();

    const weeklyAvgs = [];
    for (let day = 0; day < 7; day++) {
      // iterate through the days of the week
      const currentDay = new Date(lastWeekStart);
      currentDay.setDate(lastWeekStart.getDate() + day);
      const avgTemp = await calcAverageTemperature(deviceId, currentDay);
      if (!avgTemp.error) {
        weeklyAvgs.push(avgTemp);
      }
    }

    res.json(weeklyAvgs);
  } catch (error) {
    console.error("Error fetching last week's light sensor readings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch last week's light sensor readings" });
  }
});

// MOISTURE Sensor Readings -------------------------------------------------------
// GET all moisture sensor readings from all plants
router.get("/moisture", async (req, res) => {
  const data = await MoistureSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

// GET the most recent moisture sensor readings from a specific plant
router.get("/moisture/:deviceId", async (req, res) => {
  const data = await MoistureSensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(1);
  res.json(data);
});

// GET latest moisture sensor readings from a specific plant
router.get("/moistures/:deviceId", async (req, res) => {
  const data = await MoistureSensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/moistures/:deviceId/today", async (req, res) => {
  const { deviceId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const data = await MoistureSensorReading.find({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ timestamp: -1 })
    .limit(200);
  res.json(data);
});

router.get("/moistures/:deviceId/average", async (req, res) => {
  const { deviceId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {
    const result = await MoistureSensorReading.aggregate([
      {
        $match: {
          device: deviceId,
          timestamp: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          averageMoisture: { $avg: "$moisture" },
        },
      },
    ]);

    const average = result.length > 0 ? result[0].averageMoisture : null;
    res.json({ averageMoisture: average });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate average moisture" });
  }
});

router.get("/moistures/:deviceId/thisweek", async (req, res) => {
  const { deviceId } = req.params;

  const { firstWeekDay, daysInCurrentWeek } = getThisWeekDates();

  const weeklyAvgs = [];
  for (let day = 0; day < daysInCurrentWeek; day++) {
    // iterate through the days of the week
    const currentDay = new Date(firstWeekDay);
    currentDay.setDate(firstWeekDay.getDate() + day);
    const avgMoisture = await calcAverageMoisture(deviceId, currentDay);
    if (!avgMoisture.error) {
      weeklyAvgs.push(avgMoisture);
    }
  }

  res.json(weeklyAvgs);
});

router.get("/temperatures/:deviceId/lastweek", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const lastWeekStart = getLastWeekDates();

    const weeklyAvgs = [];
    for (let day = 0; day < 7; day++) {
      // iterate through the days of the week
      const currentDay = new Date(lastWeekStart);
      currentDay.setDate(lastWeekStart.getDate() + day);
      const avgTemp = await calcAverageTemperature(deviceId, currentDay);
      if (!avgTemp.error) {
        weeklyAvgs.push(avgTemp);
      }
    }

    res.json(weeklyAvgs);
  } catch (error) {
    console.error("Error fetching last week's light sensor readings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch last week's light sensor readings" });
  }
});

// calculate the average moisture for a specific deviceId per day

// HUMIDITY Sensor Readings -------------------------------------------------------
// GET all humidity sensor readings from all plants
router.get("/humidity", async (req, res) => {
  const data = await HumiditySensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

// GET the most recent humidity sensor readings from a specific plant
router.get("/humidity/:deviceId", async (req, res) => {
  const data = await HumiditySensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(1);
  res.json(data);
});

// GET latest humidity sensor readings from a specific plant
router.get("/humidities/:deviceId", async (req, res) => {
  const data = await HumiditySensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/humidities/:deviceId/today", async (req, res) => {
  const { deviceId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const data = await HumiditySensorReading.find({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: -1 });
  res.json(data);
});

router.get("/humidities/:deviceId/thisweek", async (req, res) => {
  const { deviceId } = req.params;

  const { firstWeekDay, daysInCurrentWeek } = getThisWeekDates();

  const weeklyAvgs = [];
  for (let day = 0; day < daysInCurrentWeek; day++) {
    // iterate through the days of the week
    const currentDay = new Date(firstWeekDay);
    currentDay.setDate(firstWeekDay.getDate() + day);
    const avgLight = await calcAverageHumidity(deviceId, currentDay);
    if (!avgLight.error) {
      weeklyAvgs.push(avgLight);
    }
  }

  res.json(weeklyAvgs);
});

router.get("/humidities/:deviceId/lastweek", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const lastWeekStart = getLastWeekDates();

    const weeklyAvgs = [];
    for (let day = 0; day < 7; day++) {
      // iterate through the days of the week
      const currentDay = new Date(lastWeekStart);
      currentDay.setDate(lastWeekStart.getDate() + day);
      const avgLight = await calcAverageLight(deviceId, currentDay);
      if (!avgLight.error) {
        weeklyAvgs.push(avgLight);
      }
      // const avgLight =
    }

    res.json(weeklyAvgs);
  } catch (error) {
    console.error("Error fetching last week's light sensor readings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch last week's light sensor readings" });
  }
});

router.get("/humidities/:deviceId/:day/average", async (req, res) => {
  // reject if req.params.day is not a valid date
  const { deviceId, day } = req.params;
  const avgLight = await calcAverageHumidity(deviceId, day);
  if (avgLight.error) {
    return res.status(avgLight.status).json({ error: avgLight.error });
  }
  res.json(avgLight);
});

export default router;
