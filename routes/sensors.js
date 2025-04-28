import express from "express";
import {
  LightSensorReading,
  MoistureSensorReading,
  TemperatureSensorReading,
} from "../db/mongo.js";

const router = express.Router();

// GET /api/sensors - All readings
router.get("/light", async (req, res) => {
  const data = await LightSensorReading.find()
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(data);
});

router.get("/temperature", async (req, res) => {
  const data = await TemperatureSensorReading.find()
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

export default router;
