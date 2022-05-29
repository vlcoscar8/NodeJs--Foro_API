import mongoose from "mongoose";

const Schema = mongoose.Schema;

const avatarFamilySchema = new Schema({
    family: { type: String, required: true },
    avatarList: [
        {
            type: mongoose.Types.ObjectId,
            red: "Avatar",
        },
    ],
    avatarSpecial: [
        {
            type: mongoose.Types.ObjectId,
            red: "Avatar",
        },
    ],
});

const AvatarFamily = mongoose.model("AvatarFamily", avatarFamilySchema);

export { AvatarFamily };
