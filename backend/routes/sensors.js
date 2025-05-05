import express from "express";
import {
  LightSensorReading,
  MoistureSensorReading,
  TemperatureSensorReading,
  HumiditySensorReading,
} from "../db/mongo.js";

const router = express.Router();

// GET /api/sensors - All readings
router.get("/lights", async (req, res) => {
  const data = await LightSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

// filter by deviceId
router.get("/lights/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  const data = await LightSensorReading.find({ device: deviceId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/temperatures", async (req, res) => {
  const data = await TemperatureSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/temperatures/:deviceId", async (req, res) => {
  const data = await TemperatureSensorReading.find({
    device: req.params.deviceId,
  })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/moisture", async (req, res) => {
  const data = await MoistureSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/moistures/:deviceId", async (req, res) => {
  const data = await MoistureSensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/humidity", async (req, res) => {
  const data = await HumiditySensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/humidities/:deviceId", async (req, res) => {
  const data = await HumiditySensorReading.find({ device: req.params.deviceId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

export default router;
