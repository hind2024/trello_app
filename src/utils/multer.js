import multer from "multer";
import { v4 as uuidv4 } from 'uuid'
import { AppError } from "./AppError.js";

export const fileVaildation = {
    image: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
    file: ["application/msword", "application/pdf"],
    video: ["video/mp4"]
}

function uploads({ folder, fileType, format }) {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${folder}`)
        },

        filename: (req, file, cb) => {
            cb(null, uuidv4() + '__' + file.originalname)
        }
    })

    function fileFilter(req, file, cb) {
        if (fileType.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new AppError(`can upload ${format} only 🤨`, 401), false)
        }
    }

    const fileUpload = multer({ storage, fileFilter })

    return fileUpload
}

export default uploads