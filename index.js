import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./db/mongo.js";
import sensorRoutes from "./routes/sensors.js";
import "./mqttClient.js"; // Start MQTT client in background

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use("/api/sensors", sensorRoutes);

app.get("/health", (req, res) => {
  res.send("Server is healthy! 🚀");
});

// Start server after DB connection
const startServer = async () => {
  await connectMongo(process.env.MONGO_URI);
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
  );
};

startServer();
