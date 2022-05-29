import express from "express";
import { getFamilyTopicsList } from "../controller/topic.controller.js";

const router = express.Router();

router.get("/family", getFamilyTopicsList);

export { router as topicRouter };
