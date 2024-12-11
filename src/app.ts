import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import cardRoutes from "./routes/cards";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/cards", cardRoutes);

// Database connection
connectDB();

export default app;
