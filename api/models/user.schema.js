import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    surname: { type: String },
    age: { type: String },
    avatarProfile: { type: String },
    coins: { type: Number, required: true },
    topics: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Topic",
        },
    ],
    avatarList: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Avatar",
        },
    ],
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
    ],
    topicsFollowing: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Topic",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.password;
    },
});

const User = mongoose.model("User", userSchema);

export { User };
