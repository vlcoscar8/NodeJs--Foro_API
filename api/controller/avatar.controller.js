import { AvatarFamily } from "../models/avatarFamily.schema.js";
import { Avatar } from "../models/avatar.schema.js";

const getFamilyTypes = async (req, res, next) => {
    try {
        const avatarList = await Avatar.find();
        const familyTypes = [...new Set(avatarList.map((el) => el.family))];

        res.status(201).json(familyTypes);
    } catch (error) {
        next(error);
    }
};

const getAvatarFamilyDetail = async (req, res, next) => {
    try {
        const { family } = req.body;
        const avatarFamilyDetail = await AvatarFamily.find({ family: family })
            .populate("avatarList")
            .populate("avatarSpecial");

        res.status(201).json(avatarFamilyDetail);
    } catch (error) {
        next(error);
    }
};

export { getAvatarFamilyDetail, getFamilyTypes };
