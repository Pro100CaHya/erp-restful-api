import { Request, Response, NextFunction } from "express";
import { DOCUMENTS_UPLOAD_FOLDER } from "src/config/consts";
import fs from "fs";


function checkIfUploadsFolderExists(req: Request, res: Response, next: NextFunction) {
    if (!fs.existsSync(DOCUMENTS_UPLOAD_FOLDER)) {
        fs.mkdirSync(DOCUMENTS_UPLOAD_FOLDER);
    }
    next();
}

export {
    checkIfUploadsFolderExists
}