import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { type: String, required: true },
    data: { type: String, required: true },
    topic: { type: String, required: true },
    likes: { type: Number, required: true },
    id: { type: String },
    replies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
    ],
    user: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
});

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };
