import express from "express";
import {
    getAvatarFamilyDetail,
    getFamilyTypes,
} from "../controller/avatar.controller.js";

const router = express.Router();

router.get("/types", getFamilyTypes);
router.get("/family", getAvatarFamilyDetail);

export { router as avatarRouter };
