import express from "express";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    editUserInfo,
    createTopic,
    createComment,
    createReply,
    setAvatarProfile,
    deleteComment,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.get("/:id", getUserDetail);
router.post("/edit/:id", editUserInfo);
router.post("/topic/:id", createTopic);
router.post("/comment/:id", createComment);
router.post("/reply/:id", createReply);
router.put("/avatar/:id", setAvatarProfile);
router.delete("/comment/:id", deleteComment);

export { router as userRouter };
