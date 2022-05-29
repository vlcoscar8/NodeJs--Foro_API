import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Dotenv
dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Server configuration
const server = express();
const router = express.Router();

server.use("/", router);
server.use(express.json());

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
