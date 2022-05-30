import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FamilyTopic } from "../models/familyTopic.schema.js";
import { Topic } from "../models/topic.schema.js";
import { User } from "../models/user.schema.js";
import { Comment } from "../models/comment.schema.js";
import { Avatar } from "../models/avatar.schema.js";

const registerUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const previousUser = await User.findOne({ email: email });

        if (previousUser) {
            const error = new Error("The user is already registered");
            return next(error);
        }

        const nameUser = await User.findOne({ username: username });

        if (nameUser) {
            const error = new Error(
                "The username is already taken, please try with other username"
            );
            return next(error);
        }
        const passwordHash = await bcrypt.hash(password, 10);

        //Set the list of avatars by default
        const randomId = Math.floor(Math.random() * (5 - 1)) + 1;
        const avatarSelected = await Avatar.findOne({ id: randomId });
        const avatarList = await Avatar.find();

        //Create new User
        const newUser = new User({
            email: email,
            password: passwordHash,
            username: username,
            coins: 0,
            avatarProfile: avatarSelected.img,
        });

        await newUser.save();

        avatarList.forEach(
            async (el) =>
                await User.findOneAndUpdate(
                    { email: newUser.email },
                    {
                        $push: { avatarList: el },
                    }
                )
        );

        const userRegistered = await User.findOne({
            email: newUser.email,
        }).populate("avatarList");

        //Set the user into the avatar by default
        await Avatar.findOneAndUpdate(
            { id: avatarSelected.id },
            {
                $push: {
                    users: userRegistered._id,
                },
            }
        );

        return res.status(201).json({
            status: 201,
            message: "User registered successfully!",
            data: userRegistered,
        });
    } catch (error) {
        next(error);
    }
};

const logInUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        const isValidPassword = await bcrypt.compare(
            password,
            user?.password ?? ""
        );

        if (!user || !isValidPassword) {
            const error = "The email or password is incorrect";

            return res.status(401).json(error);
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            req.app.get("secretKey"),
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            userId: user._id,
            token: token,
        });
    } catch (error) {
        next(error);
    }
};

const logOutUser = async (req, res, next) => {
    try {
        req.authority = null;
        return res.json({
            status: 200,
            message: "Logout!",
            token: null,
        });
    } catch (error) {
        next(error);
    }
};

const getUserDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const editUserInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userBody = req.body;

        await User.findByIdAndUpdate(id, { ...userBody });
        const userEdited = await User.findById(id);

        res.status(200).json(userEdited);
    } catch (error) {
        next(error);
    }
};

const createTopic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, wallpaper, logo, familyTopic } = req.body;

        // Check if the topic has been already created
        const topicCreated = await Topic.findOne({ title: title });

        if (topicCreated) {
            return res
                .status(201)
                .json(
                    "The topic has already been created, please try with another title"
                );
        }

        const user = await User.findById(id);

        // Create new topic and save to database
        const newTopic = new Topic({
            title: title,
            wallpaper: wallpaper,
            logo: logo,
            familyTopic: familyTopic,
        });
        await newTopic.save();

        // Push the user into the new Topic created
        await Topic.findByIdAndUpdate(newTopic._id, {
            $push: {
                user: user,
            },
        });

        // Create an id able to get from the frontend
        await Topic.findByIdAndUpdate(newTopic._id, { id: newTopic._id });

        // Find the topic created
        const topic = await Topic.findById(newTopic._id);

        // Introduce the topic into the family topic
        await FamilyTopic.findOneAndUpdate(
            { title: familyTopic },
            {
                $push: {
                    topics: topic,
                },
            }
        );

        // Introduce the topic into the user
        await User.findByIdAndUpdate(id, {
            $push: {
                topics: topic,
            },
        });

        // Get 5 coins to the user owner of the topic created
        await User.findByIdAndUpdate(id, {
            coins: user.coins + 20,
        });

        res.status(200).json(topic);
    } catch (error) {
        next(error);
    }
};

const createComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content, topic } = req.body;
        const user = await User.findById(id);

        // Check if the comment is too big
        const characterLimit = 200;
        if (content.length >= characterLimit) {
            return res
                .status(201)
                .json(
                    `The comment has exceeded character limit (${characterLimit})`
                );
        }

        // Create a new comment and save to database
        const newComment = new Comment({
            content: content,
            data: new Date(),
            topic: topic,
            replies: [],
        });

        await newComment.save();

        // Introduce the user into the comment
        await Comment.findByIdAndUpdate(newComment._id, {
            $push: {
                user: user,
            },
        });

        // Create an id able to get from the frontend
        await Comment.findByIdAndUpdate(newComment._id, { id: newComment._id });

        // Find the comment created
        const comment = await Comment.findById(newComment._id);

        // Introduce the comment into the topic
        const topicUpdated = await Topic.findOneAndUpdate(
            { title: topic },
            {
                $push: {
                    comments: comment,
                },
            }
        ).populate("user");

        // Introduce the comment into the user
        await User.findByIdAndUpdate(id, {
            $push: {
                comments: comment,
            },
        });

        // Get 5 coins to the user owner of the topic commented
        const userOwnerTopic = await User.findById(topicUpdated.user[0].id);

        const coinsUpdated = userOwnerTopic.coins + 5;

        await User.findByIdAndUpdate(topicUpdated.user[0].id, {
            $set: {
                coins: coinsUpdated,
            },
        });

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

const createReply = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content, commentId } = req.body;
        const user = await User.findById(id);

        // Check if the comment is too big
        const characterLimit = 200;
        if (content.length >= characterLimit) {
            return res
                .status(201)
                .json(
                    `The comment has exceeded character limit (${characterLimit})`
                );
        }

        //Get the topic from the parent comment
        const parentComment = await Comment.findOne({ id: commentId });

        // Create a new comment and save to database
        const newComment = new Comment({
            content: content,
            data: new Date(),
            topic: parentComment.topic,
        });

        await newComment.save();

        // Introduce the user into the comment
        await Comment.findByIdAndUpdate(newComment._id, {
            $push: {
                user: user,
            },
        });

        // Create an id able to get from the frontend
        await Comment.findByIdAndUpdate(newComment._id, { id: newComment._id });

        // Find the comment created
        const comment = await Comment.findById(newComment._id);

        // Introduce the comment into the user
        await User.findOneAndUpdate(
            { id: id },
            {
                $push: {
                    comments: comment,
                },
            }
        );

        // Introduce the reply into the comment
        const commentUpdated = await Comment.findOneAndUpdate(
            { id: commentId },
            {
                $push: {
                    replies: comment,
                },
            }
        ).populate("user");

        // Get 5 coins to the user owner of the comment
        const userOwnerComment = await User.findById(commentUpdated.user[0].id);

        const coinsUpdated = userOwnerComment.coins + 5;

        await User.findByIdAndUpdate(commentUpdated.user[0].id, {
            $set: {
                coins: coinsUpdated,
            },
        });

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

const setAvatarProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { avatarId } = req.body;

        const user = await User.findById(id).populate("avatarList");
        const avatar = await Avatar.findOne({ id: avatarId });

        // Check if the user has coins to buy the avatar
        if (user.coins < avatar.price) {
            return res
                .status(200)
                .json("The user has not coins enought to buy the avatar");
        }

        //Set the avatar choosen to the user
        await Avatar.findOneAndUpdate(
            { id: avatarId },
            {
                $push: {
                    users: user,
                },
            }
        );

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findOne({ id: id }).populate("user");

        if (comment.replies.length > 0) {
            return res
                .status(200)
                .json("The comment has replies so it can't be removed");
        }

        await User.findByIdAndUpdate(comment.user[0].id, {
            $pull: {
                comments: comment.id,
            },
        });

        await Topic.findOneAndUpdate(
            { title: comment.topic },
            {
                $pull: {
                    comments: comment.id,
                },
            }
        );

        await Comment.findOneAndRemove({ id: id });

        res.status(200).json("The comment has been removed");
    } catch (error) {
        next(error);
    }
};

const followTopic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { topicId } = req.body;

        const user = await User.findById(id);
        const topic = await Topic.findOne({ id: topicId });

        await Topic.findOneAndUpdate(
            { id: topicId },
            {
                $push: {
                    followers: user,
                },
            }
        );

        await User.findByIdAndUpdate(id, {
            $push: {
                topicsFollowing: topic,
            },
        });

        const userUpdated = await User.findById(id);
        const topicUpdated = await Topic.findOne({ id: topicId });

        res.status(200).json({
            user: userUpdated,
            topic: topicUpdated,
        });
    } catch (error) {
        next(error);
    }
};

export {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    editUserInfo,
    createTopic,
    createComment,
    createReply,
    followTopic,
    setAvatarProfile,
    deleteComment,
};
