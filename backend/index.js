import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./db/mongo.js";
import sensorRoutes from "./routes/sensors.js";
import "./mqttClient.js"; // Start MQTT client in background
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:3000", "https://myurl.onrender.com"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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
