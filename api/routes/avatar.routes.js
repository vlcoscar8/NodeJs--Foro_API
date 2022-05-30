import express from "express";
import {
    getAvatarFamilyDetail,
    getAvatarList,
} from "../controller/avatar.controller.js";

const router = express.Router();

router.get("/list", getAvatarList);
router.get("/list/:family", getAvatarFamilyDetail);

export { router as avatarRouter };
