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

const moistureSensorSchema = new mongoose.Schema({
  moisture: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const temperatureSensorSchema = new mongoose.Schema({
  temperature: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const humiditySensorSchema = new mongoose.Schema({
  temperature: Number,
  device: String,
  timestamp: { type: Date, default: Date.now },
});

const lightCommandSchema = new mongoose.Schema({
  status: ["on", "off"],
  device: String,
  timestamp: { type: Date, default: Date.now },
});

export const PlantStatusReading = mongoose.model("PlantStatus", plantStatusSchema, "plant_status");


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
