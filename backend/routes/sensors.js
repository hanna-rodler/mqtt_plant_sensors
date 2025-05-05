import express from "express";
import {
  LightSensorReading,
  MoistureSensorReading,
  TemperatureSensorReading,
  HumiditySensorReading,
} from "../db/mongo.js";

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

export default router;
