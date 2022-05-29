import mongoose from "mongoose";

const Schema = mongoose.Schema;

const avatarFamilySchema = new Schema({
    family: { type: String, required: true },
    avatarList: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Avatar",
        },
    ],
    avatarSpecial: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Avatar",
        },
    ],
});

const AvatarFamily = mongoose.model("AvatarFamily", avatarFamilySchema);

export { AvatarFamily };
