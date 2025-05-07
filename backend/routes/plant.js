import express from "express";
import {
    LightSensorReading,
    PlantStatusReading
} from "../db/mongo.js";

const router = express.Router();

router.post("/plants/:plantId/status", async (req, res) => {
    const { plantId } = req.params;
    const { status } = req.body;

    try {
        const newStatus = new PlantStatusReading({
            status,
            plant: plantId,
        });
        await newStatus.save();
        res.status(201).json(newStatus);
    } catch (err) {
        console.error("Fehler beim Speichern des Status:", err);
        res.status(500).json({ message: "Fehler beim Speichern" });
    }
});

// GET latest status readings from a specific plant
router.get("/plants/:plantId/status", async (req, res) => {
    const data = await PlantStatusReading.find({ plant: req.params.plantId })
        .sort({ timestamp: -1 })
        .limit(1);
    res.json(data);
});

export default router;