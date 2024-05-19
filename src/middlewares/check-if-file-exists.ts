import { NextFunction, Request, Response } from "express";

import { HttpException } from "src/exceptions";
import { FileService } from "src/file/file.service";
import { RequestWithUserAndFile } from "src/interfaces";

async function checkIfFileExists(request: RequestWithUserAndFile, response: Response, next: NextFunction) {
    const { id } = request.params;
    const fileService = new FileService();

    if (!id) {
        next(new HttpException(400, "File id must be sent"));
    }

    try {
        const fileData = await fileService.getFileInfo(+id);
        request.fileData = fileData;
        next();
    } catch (error) {
        next(error);
    }
}

export {
    checkIfFileExists
}
