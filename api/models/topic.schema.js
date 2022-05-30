import mongoose from "mongoose";

const Schema = mongoose.Schema;

const topicSchema = new Schema({
    id: { type: String },
    title: { type: String, required: true },
    wallpaper: { type: String },
    logo: { type: String, required: true },
    familyTopic: { type: String, required: true },
    user: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],

    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

const Topic = mongoose.model("Topic", topicSchema);

export { Topic };
