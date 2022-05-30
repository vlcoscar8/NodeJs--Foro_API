import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./config/db.js";
import { avatarRouter } from "./api/routes/avatar.routes.js";
import { userRouter } from "./api/routes/user.routes.js";
import { topicRouter } from "./api/routes/topic.routes.js";
import { commentRouter } from "./api/routes/comment.routes.js";

// Dotenv
dotenv.config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Server configuration
const server = express();
const router = express.Router();
server.set("secretKey", "nodeRestApi");
server.use("/", router);
server.use(express.json());
server.use(
    cors({
        origin: `*`,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
server.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
        store: MongoStore.create({
            mongoUrl: DB_URL,
        }),
    })
);

//Routes
server.use("/avatar", avatarRouter);
server.use("/user", userRouter);
server.use("/topic", topicRouter);
server.use("/comment", commentRouter);
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
