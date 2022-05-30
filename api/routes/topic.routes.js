import express from "express";
import {
    getFamilyTopicsList,
    getFamilyDetail,
    getTopicDetail
} from "../controller/topic.controller.js";

const router = express.Router();

router.get("/family", getFamilyTopicsList);
router.get("/family/:id", getFamilyDetail);
router.get("/:id", getTopicDetail);

export { router as topicRouter };
