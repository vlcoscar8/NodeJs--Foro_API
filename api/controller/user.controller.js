import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.schema.js";

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

        const newUser = new User({
            email: email,
            password: passwordHash,
            username: username,
            avatar: "https://res.cloudinary.com/oscar-perez/image/upload/v1651068282/RecipeAssets/FoodCategory/userImage_hsw5hj.png",
        });

        await newUser.save();

        return res.status(201).json({
            status: 201,
            message: "User registered successfully!",
            data: newUser,
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

        return res.json({
            status: 200,
            message: "Loggin success!",
            data: {
                userId: user._id,
                token: token,
            },
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

        return res.status(200).json({
            status: 200,
            message: "User successfully finded",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export { registerUser, logInUser, logOutUser, getUserDetail };
