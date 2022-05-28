import express from "express";

const server = express();
const router = express.Router();
const PORT = 3200;

server.use("/", router);

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
