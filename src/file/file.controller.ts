import { Router, Request, Response, NextFunction } from "express";

import { checkIfFileExists, checkIfUploadsFolderExists, checkIsAuthenticated } from "src/middlewares";
import { Controller, RequestWithUser, RequestWithUserAndFile } from "src/interfaces";
import { FileService } from "./file.service";
import { uploadFiles } from "src/middlewares";
import { File } from "./file.interface";
import { DOCUMENTS_UPLOAD_FOLDER } from "src/config/consts";

class FileController implements Controller {
    public path = "/files";
    public router = Router();
    private fileService = new FileService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/upload`, checkIfUploadsFolderExists, checkIsAuthenticated, uploadFiles.single("file"), this.uploadFile);
        this.router.get(`${this.path}/list`, checkIsAuthenticated, this.getFilesList);
        this.router.delete(`${this.path}/delete/:id`, checkIsAuthenticated, this.deleteFile);
        this.router.get(`${this.path}/:id`, checkIsAuthenticated, this.getFileInfo);
        this.router.get(`${this.path}/download/:id`, checkIsAuthenticated, this.downloadFile);
        this.router.put(`${this.path}/update/:id`, checkIsAuthenticated, checkIfFileExists, uploadFiles.single("file"), this.updateFile);
    }

    private uploadFile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const {
                filename: filename,
                mimetype: mimeType,
                size: size
            } = req.file;

            const fileData: File = {
                filename,
                mimeType,
                size,
                userId: req.user.id
            }

            const createdFile = await this.fileService.createFile(fileData);

            return res.status(201).json(createdFile);
        } catch (error) {
            next(error);
        }
    }

    private getFilesList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                list_size: listSize = 10,
                page = 1
            } = req.query;

            const filesList = await this.fileService.getFilesList(+page, +listSize);

            res.status(200).json(filesList);
        } catch (error) {
            next(error);
        }
    }

    private deleteFile = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            const deletedFile = await this.fileService.deleteFile(+id);

            res.status(200).json(deletedFile);
        } catch (error) {
            next(error);
        }
    }

    private getFileInfo = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const file = await this.fileService.getFileInfo(+id);

            res.status(200).json(file);
        } catch (error) {
            next(error);
        }
    }

    private downloadFile = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            const file: File = await this.fileService.downloadFile(+id);

            res
                .header("Content-Disposition", `attachment; filename=${file.filename}`)
                .header("Content-Type", file.mimeType)
                .status(200)
                .sendFile(`${DOCUMENTS_UPLOAD_FOLDER}/${file.filename}`);
        } catch (error) {
            next(error);
        }
    }

    private updateFile = async (req: RequestWithUserAndFile, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const {
                filename: filename,
                mimetype: mimeType,
                size: size
            } = req.file;

            const actualFileData: File = {
                filename,
                mimeType,
                size,
                userId: req.user.id
            }

            const previousFileData = req.fileData;

            const updatedFile = await this.fileService.updateFile(+id, actualFileData, previousFileData);

            res.status(200).json(updatedFile);
        } catch (error) {
            next(error);
        }
    }
}

export {
    FileController
}