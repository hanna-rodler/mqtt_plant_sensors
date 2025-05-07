import mongoose from "mongoose";

const plantStatusSchema = new mongoose.Schema({
  status: String,
  plant: String,
  timestamp: { type: Date, default: Date.now },
});

const lightSensorSchema = new mongoose.Schema({
  light: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const lightAvgSchema = new mongoose.Schema({
  avg: Number,
  device: String,
  timestamp: Date,
});

const moistureSensorSchema = new mongoose.Schema({
  moisture: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const moistureAvg = new mongoose.Schema({
  avg: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const temperatureSensorSchema = new mongoose.Schema({
  temperature: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const temperatureAvg = new mongoose.Schema({
  avg: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const humiditySensorSchema = new mongoose.Schema({
  humidity: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const humidityAvg = new mongoose.Schema({
  avg: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const lightCommandSchema = new mongoose.Schema({
  status: String,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

export const PlantStatusReading = mongoose.model("PlantStatus", plantStatusSchema, "plant_status");

export const PlantResultReading = mongoose.model("PlantResult", plantStatusSchema, "plant_results");

export const LightSensorReading = mongoose.model("light", lightSensorSchema);

export const MoistureSensorReading = mongoose.model(
  "moisture",
  moistureSensorSchema
);

export const TemperatureSensorReading = mongoose.model(
  "temperature",
  temperatureSensorSchema
);

export const HumiditySensorReading = mongoose.model(
  "humidity",
  humiditySensorSchema
);

export const LightAvg = mongoose.model("light_avg", lightAvgSchema);
export const TemperatureAvg = mongoose.model("temperature_avg", temperatureAvg);
export const HumidityAvg = mongoose.model("humidity_avg", humidityAvg);
export const MoistureAvg = mongoose.model("moisture_avg", moistureAvg);

export const LightCommand = mongoose.model("lightCommands", lightCommandSchema);

export const connectMongo = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
