import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { avatarRouter } from "./api/routes/avatar.routes.js";

// Dotenv
dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Server configuration
const server = express();
const router = express.Router();

server.use("/", router);
server.use(express.json());

//Routes
server.use("/avatar", avatarRouter);

// Errors
server.use("*", (req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});
server.use((error, req, res, next) => {
    return res
        .status(error.status || 500)
        .json(error.message || "Unexpected error");
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
