import express from "express";
import { connectDb } from "./config/dbConenction.js";
import cors from "cors";
import dotenv from "dotenv";  // Import dotenv

// Load environment variables from .env file
dotenv.config();

// *********** All-Routes *************
import auth from "./routes/auth.routes.js";
import user from "./routes/user.routes.js";
// *********** All-Routes *************

import cookieParser from "cookie-parser";
const app = express();

// Use cors middleware
app.use(cors());

app.use(
  cors({
    origin: "*", // Replace with the frontend's URL (React app)
    methods: "GET,POST,PUT,DELETE,PATCH", // Allowed methods
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// *********** All-Routes *************
app.get("/", (req, res) => {
  res.json("I'm coming from backend");
});
app.use("/api/auth/v1", auth);
app.use("/api/user/v1", user);

// For wrong routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Please check the URL and try again.",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
    error: err.message,
  });
});

// Use the port from .env or default to 3000 if not set
const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDb();
});
