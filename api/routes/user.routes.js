import express from "express";
import { upload, uploadToCloudinary } from "../../middleware/cloudinary.js";
import { isAuth } from "../../middleware/jwt.js";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    editUserInfo,
    createTopic,
    createComment,
    createReply,
    followTopic,
    setAvatarProfile,
    deleteComment,
    getUserDetailByUsername,
    deleteFollow,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.get("/:id", getUserDetail);
router.get("/name/:username", getUserDetailByUsername);
router.post(
    "/edit/:id",
    [upload.single("img"), uploadToCloudinary],
    editUserInfo
);
router.post(
    "/topic/:id",
    [upload.single("wallpaper"), uploadToCloudinary, isAuth],
    createTopic
);
router.post("/comment/:id", createComment);
router.post("/reply/:id", createReply);
router.post("/follow/:id", followTopic);
router.post("/avatar/:id", setAvatarProfile);
router.delete("/comment/:id", deleteComment);
router.delete("/followed/:id", deleteFollow);

export { router as userRouter };
