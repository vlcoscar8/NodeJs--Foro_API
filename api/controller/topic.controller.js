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

const getFamilyDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const familyTopicDetail = await FamilyTopic.find({ id: id }).populate(
            "topics"
        );

        res.status(200).json(familyTopicDetail);
    } catch (error) {
        next(error);
    }
};

const getTopicDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const topicDetail = await Topic.find({ id: id }).populate("user");

        res.status(200).json(topicDetail);
    } catch (error) {
        next(error);
    }
};

export { getFamilyTopicsList, getFamilyDetail, getTopicDetail };
