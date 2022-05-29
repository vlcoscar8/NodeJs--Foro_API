import express from "express";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    editUserInfo,
    createTopic,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.get("/:id", getUserDetail);
router.post("/edit/:id", editUserInfo);
router.post("/topic/:id", createTopic);

export { router as userRouter };
