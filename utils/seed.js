import mongoose from "mongoose";
import dotenv from "dotenv";
import { Avatar } from "../api/models/avatar.schema.js";
import { FamilyTopic } from "../api/models/familyTopic.schema.js";
import { AvatarFamily } from "../api/models/avatarFamily.schema.js";
import { avatarData, familyTopicData, avatarFamilyData } from "./data.js";

dotenv.config();
const DB_URL = process.env.DB_URL;

const avatarsDoc = avatarData.map((element) => new Avatar(element));
const familyTopicDoc = familyTopicData.map(
    (element) => new FamilyTopic(element)
);
const avatarFamilyDoc = avatarFamilyData.map(
    (element) => new AvatarFamily(element)
);

const creationSeed = mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        await createCollections();
        await updateNoobAvatarFamily();
        await updateAmateurAvatarFamily();
        await updateProAvatarFamily();
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        console.log("Seed created successfully");
        mongoose.disconnect();
    });

const createCollections = async () => {
    await Avatar.collection.drop();
    await Avatar.insertMany(avatarsDoc);

    await FamilyTopic.collection.drop();
    await FamilyTopic.insertMany(familyTopicDoc);

    await AvatarFamily.collection.drop();
    await AvatarFamily.insertMany(avatarFamilyDoc);
};

const updateNoobAvatarFamily = async () => {
    const noobAvatarList = await Avatar.find({
        $and: [{ family: "Noob" }, { type: "Common" }],
    });
    const noobSpecialAvatar = await Avatar.find({
        $and: [{ family: "Noob" }, { type: "Special" }],
    });

    noobAvatarList.forEach(async (element) => {
        await AvatarFamily.findOneAndUpdate(
            { family: "Noob" },
            {
                $push: {
                    avatarList: element,
                },
            }
        );
    });

    await AvatarFamily.findOneAndUpdate(
        { family: "Noob" },
        {
            $push: {
                avatarSpecial: noobSpecialAvatar,
            },
        }
    );
};

const updateAmateurAvatarFamily = async () => {
    const amateurAvatarList = await Avatar.find({
        $and: [{ family: "Amateur" }, { type: "Common" }],
    });
    const amateurSpecialAvatar = await Avatar.find({
        $and: [{ family: "Amateur" }, { type: "Special" }],
    });

    amateurAvatarList.forEach(async (element) => {
        await AvatarFamily.findOneAndUpdate(
            { family: "Amateur" },
            {
                $push: {
                    avatarList: element,
                },
            }
        );
    });

    await AvatarFamily.findOneAndUpdate(
        { family: "Amateur" },
        {
            $push: {
                avatarSpecial: amateurSpecialAvatar,
            },
        }
    );
};

const updateProAvatarFamily = async () => {
    const proAvatarList = await Avatar.find({
        $and: [{ family: "Pro" }, { type: "Common" }],
    });
    const proSpecialAvatar = await Avatar.find({
        $and: [{ family: "Pro" }, { type: "Special" }],
    });

    proAvatarList.forEach(async (element) => {
        await AvatarFamily.findOneAndUpdate(
            { family: "Pro" },
            {
                $push: {
                    avatarList: element,
                },
            }
        );
    });

    await AvatarFamily.findOneAndUpdate(
        { family: "Pro" },
        {
            $push: {
                avatarSpecial: proSpecialAvatar,
            },
        }
    );
};
