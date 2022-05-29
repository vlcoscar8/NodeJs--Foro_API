import express from "express";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.get("/:id", getUserDetail);

export { router as userRouter };
