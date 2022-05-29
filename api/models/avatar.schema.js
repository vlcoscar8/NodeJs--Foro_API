import mongoose from "mongoose";

const Schema = mongoose.Schema;

const avatarSchema = new Schema({
    family: { type: String, required: true },
    img: { type: String, required: true },
    users: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    price: { type: Number, required: true },
    type: { type: String, required: true },
    id: { type: Number, required: true },
});

const Avatar = mongoose.model("Avatar", avatarSchema);

export { Avatar };
