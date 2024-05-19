import multer from "multer";
import { DOCUMENTS_UPLOAD_FOLDER } from "src/config/consts";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DOCUMENTS_UPLOAD_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadFiles = multer({
    storage,
    limits: { fieldSize: 10 * 1024 * 1024 }
});

export {
    uploadFiles
}