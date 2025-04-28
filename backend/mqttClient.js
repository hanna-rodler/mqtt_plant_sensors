import mqtt from "mqtt";
import {
  LightSensorReading,
  MoistureSensorReading,
  TemperatureSensorReading,
} from "./db/mongo.js";

const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("🔌 MQTT connected");
  client.subscribe("sensors/+/light");
  client.subscribe("sensors/+/moisture");
  client.subscribe("sensors/+/temperature");
});

client.on("message", async (topic, message) => {
  try {
    console.log("📬 MQTT message received:", topic, message.toString());
    // {temperature: 28, light: 200} parse this object to string

    // regex to match the topic sensors/*/light
    const raw = message.toString();
    const payload = JSON.parse(raw);

    let reading;
    if (topic.match(/sensors\/([^/]+)\/light/)) {
      console.log("Light message received:");
      reading = new LightSensorReading({
        light: payload.light,
      });
      // TODO: publish on/off based on light level
    } else if (topic.match(/sensors\/([^/]+)\/moisture/)) {
      console.log("Moisture message received:", payload);
      reading = new MoistureSensorReading({
        moisture: payload.moisture,
      });
    } else if (topic.match(/sensors\/([^/]+)\/temperature/)) {
      console.log("Temperature message received:");
      reading = new TemperatureSensorReading({
        temperature: payload.temperature,
      });
    } else {
      console.log("Unknown topic:", topic);
      return;
    }

    await reading.save();
    console.log("💾 Saved to MongoDB");
  } catch (err) {
    console.error("❌ MQTT error:", err);
  }
});
