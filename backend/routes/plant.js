import express from "express";
import {
    LightSensorReading, PlantResultReading,
    PlantStatusReading
} from "../db/mongo.js";

import {calcAverageLight, calcAverageScore, getLastWeekDates, getThisWeekDates} from "../utils/utils.js";

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


// GET latest plant result readings from a specific plant
router.get("/plants/:plantId/result", async (req, res) => {
    const data = await PlantResultReading.find({ plant: req.params.plantId })
        .sort({ timestamp: -1 })
        .limit(1);
    res.json(data);
});

// GET plant result readings from the current day for a specific plantId
router.get("/plants/scores/:plantId/today", async (req, res) => {
    const { plantId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const data = await PlantResultReading.find({
        plant: plantId,
        evaluated_at: { $gte: startOfDay, $lte: endOfDay },
    })
        .sort({ timestamp: -1 })
        .limit(200);
    res.json(data);
});

router.get("/plants/scores/:plantId/thisweek", async (req, res) => {
    const { plantId } = req.params;

    const { firstWeekDay, daysInCurrentWeek } = getThisWeekDates();

    const weeklyAvgs = [];
    for (let day = 0; day < daysInCurrentWeek; day++) {
        // iterate through the days of the week
        const currentDay = new Date(firstWeekDay);
        currentDay.setDate(firstWeekDay.getDate() + day);
        const avgScore = await calcAverageScore(plantId, currentDay);
        if (!avgScore.error) {
            weeklyAvgs.push(avgScore);
        }
    }

    res.json(weeklyAvgs);
});

router.get("/plants/scores/:plantId/lastweek", async (req, res) => {
    try {
        const { plantId } = req.params;
        const lastWeekStart = getLastWeekDates();

        const weeklyAvgs = [];
        for (let day = 0; day < 7; day++) {
            // iterate through the days of the week
            const currentDay = new Date(lastWeekStart);
            currentDay.setDate(lastWeekStart.getDate() + day);
            const avgLight = await calcAverageScore(plantId, currentDay);
            if (!avgLight.error) {
                weeklyAvgs.push(avgLight);
            }

        }

        res.json(weeklyAvgs);
    } catch (error) {
        console.error("Error fetching last week's score readings:", error);
        res
            .status(500)
            .json({ error: "Failed to fetch last week's score readings" });
    }
});



export default router;