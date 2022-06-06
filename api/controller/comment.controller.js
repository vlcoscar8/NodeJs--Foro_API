import { Comment } from "../models/comment.schema.js";
import { Topic } from "../models/topic.schema.js";

const getCommentDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findOne({ id: id });

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

const getCommentList = async (req, res, next) => {
    try {
        const { id } = req.params;

        const topicFinded = await Topic.find({ id: id }).populate("comments");

        res.status(200).json(topicFinded);
    } catch (error) {
        next(error);
    }
};

export { getCommentDetail, getCommentList };
