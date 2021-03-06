import mongoose from "mongoose";

const Schema = mongoose.Schema;

const familyTopicSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    logo: { type: String, required: true },
    topics: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Topic",
        },
    ],
});

const FamilyTopic = mongoose.model("FamilyTopic", familyTopicSchema);

export { FamilyTopic };
