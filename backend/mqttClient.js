import mqtt from "mqtt";
import {
  LightSensorReading,
  MoistureSensorReading,
  HumiditySensorReading,
  TemperatureSensorReading,
} from "./db/mongo.js";
import dotenv from "dotenv";
dotenv.config();

let options = {
  host: process.env.MQTT_BROKER,
  port: 8883,
  protocol: "mqtts",
  username: process.env.HIVE_USERNAME,
  password: process.env.HIVE_PW,
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("🔌 MQTT connected on HiveMQ");
  client.subscribe("sensors/+/light");
  client.subscribe("sensors/+/moisture");
  client.subscribe("sensors/+/temperature");
  client.subscribe("sensors/+/humidity");
});

client.on("message", async (topic, message) => {
  try {
    console.log("📬 MQTT message received:", topic, message.toString());
    // {temperature: 28, light: 200} parse this object to string

    // regex to match the topic sensors/*/light
    // const raw = message.toString();
    // const payload = JSON.parse(raw);

    let deviceId = topic.split("/")[1]; // Extract device ID from the topic

    let reading;
    if (topic.match(/sensors\/([^/]+)\/light/)) {
      console.log("Light message received:", message.toString());
      const light = message.toString();
      reading = new LightSensorReading({
        light: message.toString(),
        device: deviceId,
      });
      // TODO: publish on/off based on light level
      // const message = JSON.stringify({ state: "on" });

      const topic = `commands/${deviceId}/lightbulb`;
      client.publish(topic, message, (err) => {
        if (err) {
          console.log("❌ Error publishing:", err);
        } else {
          console.log("✅ Message published to ".topic);
          if (light.toNumber() > 100) {
            const lightCommand = new LightCommand({
              status: "on",
              device: deviceId,
            });
          } else {
            const lightCommand = new LightCommand({
              status: "off",
              device: deviceId,
            });
          }
          lightCommand.save();
          console.log("💾 Saved light command to MongoDB");
        }

        // After publishing, disconnect the client
      });
    } else if (topic.match(/sensors\/([^/]+)\/moisture/)) {
      console.log("Moisture message received:", message.toString());
      reading = new MoistureSensorReading({
        moisture: message.toString(),
        device: deviceId,
      });
    } else if (topic.match(/sensors\/([^/]+)\/temperature/)) {
      const raw = message.toString();
      const payload = JSON.parse(raw);
      console.log("Temperature message received:", message.toString());
      reading = new TemperatureSensorReading({
        temperature: message.toString(),
        device: deviceId,
      });
    } else if (topic.match(/sensors\/([^/]+)\/humidity/)) {
      console.log("Temperature message received:", message.toString());
      reading = new HumiditySensorReading({
        temperature: message.toString(),
        device: deviceId,
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

client.on("error", (error) => {
  console.log("❌ MQTT connection error:", error);
});

client.on("close", () => {
  console.log("⚠️ MQTT connection closed");
});

client.on("offline", () => {
  console.log("⚠️ MQTT client is offline");
});
