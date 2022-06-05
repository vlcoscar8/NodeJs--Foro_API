import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../temp"));
    },
});

const fileFilter = (req, file, cd) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        cd(new Error("Invalid file type"));
    } else {
        cd(null, true);
    }
};

const uploadToCloudinary = async (req, res, next) => {
    if (req.file) {
        try {
            const filePath = req.file.path;
            const image = await cloudinary.v2.uploader.upload(filePath);

            await fs.unlinkSync(filePath);

            req.file_url = image.secure_url;
            return next();
        } catch (error) {
            return next(error);
        }
    } else {
        return next();
    }
};

const upload = multer({
    storage,
    fileFilter,
});

export { upload, uploadToCloudinary };
