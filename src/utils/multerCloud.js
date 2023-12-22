import multer from "multer";

function uploadCloud() {

    const storage = multer.diskStorage({})

    const fileUpload = multer({ storage })

    return fileUpload
}

export default uploadCloud