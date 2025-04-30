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
  client.subscribe("sensors/+/humidty");

  const message = JSON.stringify({ light: 532 });

  // Publish the message to the topic "sensors/device1/temperature"
  const device = "device1";
  const topic = `sensors/${device}/light`;
  client.publish(topic, message, (err) => {
    if (err) {
      console.log("❌ Error publishing:", err);
    } else {
      console.log("✅ Message published to ".topic);
    }

    // After publishing, disconnect the client
    // client.end();
  });
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
    // if (topic.match(/sensors\/([^/]+)\/light/)) {
    //   console.log("Light message received:");
    //   reading = new LightSensorReading({
    //     light: payload.light,
    //     device: deviceId,
    //   });
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
    // } else if (topic.match(/sensors\/([^/]+)\/moisture/)) {
    //   console.log("Moisture message received:", payload);
    //   reading = new MoistureSensorReading({
    //     moisture: payload.moisture,
    //     device: deviceId,
    //   });
    // } else
    if (topic.match(/sensors\/([^/]+)\/temperature/)) {
      console.log("Temperature message received:", message);
      reading = new TemperatureSensorReading({
        temperature: message.toString(),
        device: deviceId,
      });
      // } else if (topic.match(/sensors\/([^/]+)\/temperature/)) {
      //   console.log("Temperature message received:", message);
      //   reading = new TemperatureSensorReading({
      //     temperature: message.toString(),
      //     device: deviceId,
      //   });
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
