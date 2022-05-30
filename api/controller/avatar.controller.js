import { AvatarFamily } from "../models/avatarFamily.schema.js";
import { Avatar } from "../models/avatar.schema.js";

const getAvatarList = async (req, res, next) => {
    try {
        const avatarList = await Avatar.find();

        res.status(201).json(avatarList);
    } catch (error) {
        next(error);
    }
};

const getAvatarFamilyDetail = async (req, res, next) => {
    try {
        const { family } = req.params;

        const avatarFamilyDetail = await Avatar.find({ family: family });

        res.status(201).json(avatarFamilyDetail);
    } catch (error) {
        next(error);
    }
};

export { getAvatarFamilyDetail, getAvatarList };
