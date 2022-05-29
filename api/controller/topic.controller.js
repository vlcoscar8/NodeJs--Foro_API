import { Topic } from "../models/topic.schema.js";
import { FamilyTopic } from "../models/familyTopic.schema.js";

const getFamilyTopicsList = async (req, res, next) => {
    try {
        const familyTopicsList = await FamilyTopic.find();

        res.status(200).json(familyTopicsList);
    } catch (error) {
        next(error);
    }
};

export { getFamilyTopicsList };
