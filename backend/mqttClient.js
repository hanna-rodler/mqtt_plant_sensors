import mqtt from "mqtt";
import {
  LightSensorReading,
  MoistureSensorReading,
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
      // const message = JSON.stringify({ state: "on" });

      // // Publish the message to the topic "sensors/device1/temperature"
      // const device = "device1";
      // const topic = `commands/${device}/lightbulb`;
      // client.publish(topic, message, (err) => {
      //   if (err) {
      //     console.log("❌ Error publishing:", err);
      //   } else {
      //     console.log("✅ Message published to ".topic);
      //   }

      //   // After publishing, disconnect the client
      //   // client.end();
      // });
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

client.on("message", function (topic, message) {
  // called each time a message is received
  console.log("Received message:", topic, message.toString());
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
