import {
  LightSensorReading,
  MoistureSensorReading,
  TemperatureSensorReading,
  HumiditySensorReading,
  LightAvg,
  TemperatureAvg,
  MoistureAvg,
  HumidityAvg,
  ScoreAvg,
  PlantResultReading,
} from "../db/mongo.js";
import { startOfWeek, isToday, isYesterday } from "date-fns";
import Plant from "../routes/plant.js";

export async function calcAverageLight(deviceId, day) {
  const date = new Date(day);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const middleOfDay = new Date(date.setHours(12, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const existingAvg = await LightAvg.findOne({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });
  if (
    existingAvg &&
    existingAvg.avg !== null &&
    !isToday(date) &&
    !isYesterday(date)
  ) {
    return existingAvg;
  } else {
    try {
      console.log("Looking for light average ", date);
      const result = await LightSensorReading.aggregate([
        {
          $match: {
            device: deviceId,
            timestamp: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            averageLight: { $avg: "$light" },
          },
        },
      ]);

      const average = result.length > 0 ? result[0].averageLight : null;
      const lightAvg = new LightAvg({
        avg: average,
        device: deviceId,
        timestamp: middleOfDay,
      });
      try {
        lightAvg.save();
        console.log("💾 Saved light average to MongoDB", lightAvg.timestamp);
      } catch (err) {
        console.error("❌ Error saving light average to MongoDB:", err);
      }
      return lightAvg;
    } catch (err) {
      return { error: "Failed to calculate average light", status: 500 };
    }
  }
}

export async function calcAverageTemperature(deviceId, day) {
  const date = new Date(day);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const middleOfDay = new Date(date.setHours(12, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const existingAvg = await TemperatureAvg.findOne({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });
  if (
    existingAvg &&
    existingAvg.avg !== null &&
    !isToday(date) &&
    !isYesterday(date)
  ) {
    console.log("Found existing average:", existingAvg);
    return existingAvg;
  } else {
    try {
      const result = await TemperatureSensorReading.aggregate([
        {
          $match: {
            device: deviceId,
            timestamp: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            avg: { $avg: "$temperature" },
          },
        },
      ]);

      const average = result.length > 0 ? result[0].avg : null;
      const sensorAvg = new TemperatureAvg({
        avg: average,
        device: deviceId,
        timestamp: middleOfDay,
      });
      try {
        sensorAvg.save();
        console.log("💾 Saved temperature average to MongoDB");
      } catch (err) {
        console.error("❌ Error saving temperature average to MongoDB:", err);
      }
      return sensorAvg;
    } catch (err) {
      return { error: "Failed to calculate average temperature", status: 500 };
    }
  }
}

export async function calcAverageMoisture(deviceId, day) {
  const date = new Date(day);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const middleOfDay = new Date(date.setHours(12, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const existingAvg = await MoistureAvg.findOne({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });
  if (
    existingAvg &&
    existingAvg.avg &&
    existingAvg.avg !== null &&
    !isToday(date) &&
    !isYesterday(date)
  ) {
    console.log("Found existing average:", existingAvg);
    return existingAvg;
  } else {
    console.log("Looking for moisture average");
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
            avg: { $avg: "$moisture" },
          },
        },
      ]);

      const average = result.length > 0 ? result[0].avg : null;
      const sensorAvg = new MoistureAvg({
        avg: average,
        device: deviceId,
        timestamp: middleOfDay,
      });
      try {
        if (sensorAvg.avg !== null) {
          sensorAvg.save();
          console.log("💾 Saved temperature average to MongoDB");
        } else {
        }
      } catch (err) {
        console.error("❌ Error saving temperature average to MongoDB:", err);
      }
      return sensorAvg;
    } catch (err) {
      return { error: "Failed to calculate average temperature", status: 500 };
    }
  }
}

export async function calcAverageHumidity(deviceId, day) {
  const date = new Date(day);
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const middleOfDay = new Date(date.setHours(12, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const existingAvg = await HumidityAvg.findOne({
    device: deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });
  if (
    existingAvg &&
    existingAvg.avg &&
    existingAvg.avg !== null &&
    !isToday(date) &&
    !isYesterday(date)
  ) {
    console.log("Found existing average:", existingAvg);
    return existingAvg;
  } else {
    console.log("Looking for moisture average");
    try {
      const result = await HumiditySensorReading.aggregate([
        {
          $match: {
            device: deviceId,
            timestamp: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            avg: { $avg: "$humidity" },
          },
        },
      ]);

      const average = result.length > 0 ? result[0].avg : null;
      const sensorAvg = new HumidityAvg({
        avg: average,
        device: deviceId,
        timestamp: middleOfDay,
      });
      try {
        sensorAvg.save();
        console.log("💾 Saved temperature average to MongoDB");
      } catch (err) {
        console.error("❌ Error saving temperature average to MongoDB:", err);
      }
      return sensorAvg;
    } catch (err) {
      return { error: "Failed to calculate average temperature", status: 500 };
    }
  }
}

export function getLastWeekDates() {
  const today = new Date();
  const firstWeekDay = startOfWeek(today, { weekStartsOn: 1 });
  const lastWeekStart = new Date(firstWeekDay);
  lastWeekStart.setDate(firstWeekDay.getDate() - 7);
  const lastWeekEnd = new Date(firstWeekDay);
  lastWeekEnd.setDate(firstWeekDay.getDate() - 1);
  lastWeekEnd.setHours(23, 59, 59, 999);
  return lastWeekStart;
}

export function getThisWeekDates() {
  const today = new Date();
  const firstWeekDay = startOfWeek(today, { weekStartsOn: 1 });
  console.log("firstWeekDay ", firstWeekDay);
  const endOfWeek = new Date(today.setHours(23, 59, 59, 999));
  const daysInCurrentWeek = endOfWeek.getDay();
  return { firstWeekDay: firstWeekDay, daysInCurrentWeek: daysInCurrentWeek };
}

export async function calcAverageScore(plantId, day) {
  const date = new Date(day);
  if (isNaN(date.getTime())) {
    return { error: "Invalid date", status: 400 };
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAvg = await ScoreAvg.findOne({
    plant: plantId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });

  if (
    existingAvg &&
    existingAvg.avg !== null &&
    !isToday(date) &&
    !isYesterday(date)
  ) {
    return existingAvg;
  }

  try {
    const testRes = await PlantResultReading.findOne({ plant: plantId });
    console.log("testRes", testRes);
    const result = await PlantResultReading.aggregate([
      {
        $match: {
          plant: plantId,
          evaluated_at: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" },
        },
      },
    ]);

    console.log("result ", result);

    const average = result.length > 0 ? result[0].averageScore : null;

    const scoreAvg = new ScoreAvg({
      avg: average,
      plant: plantId,
      timestamp: startOfDay,
    });

    try {
      await scoreAvg.save();
      console.log("💾 Saved score average to MongoDB");
    } catch (err) {
      console.error("❌ Error saving score average to MongoDB:", err);
    }

    return scoreAvg;
  } catch (err) {
    console.error("❌ Aggregation failed:", err);
    return { error: "Failed to calculate average score", status: 500 };
  }
}
