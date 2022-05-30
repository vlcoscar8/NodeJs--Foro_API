import express from "express";
import {
    getCommentDetail,
    getCommentList,
} from "../controller/comment.controller.js";

const router = express.Router();

router.get("/:id", getCommentDetail);
router.get("/list/:id", getCommentList);

export { router as commentRouter };
