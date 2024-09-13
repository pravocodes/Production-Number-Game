import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Ensure the correct path for db.js
import authRoute from "./Routes/authRoute.js"; // Ensure the correct path for authRoute.js
import scoreRoute from "./Routes/scoreRoute.js"; // Ensure the correct path for scoreRoute.js
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan"

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();

// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

// Define API routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/score", scoreRoute);

app.use(express.static(path.join(__dirname, "./client/build")));

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// Define the port from environment variables or use 5100 as a fallback
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
