import path from "path";

import { File } from "./file.interface";
import { FileRepository } from "./file.repository";
import { HttpException } from "src/exceptions";
import fs from "fs";
import { Multer } from "multer";
import { DOCUMENTS_UPLOAD_FOLDER } from "src/config/consts";

class FileService {
    private fileRepository = new FileRepository();

    public async createFile(fileData: File) {
        return await this.fileRepository.createFile({
            ...fileData,
            extension: path.extname(fileData.filename)
        });
    }

    public async getFilesList(page: number, listSize: number) {
        const filesList = await this.fileRepository.getFilesList(page, listSize);

        if (filesList.length === 0) {
            throw new HttpException(
                404,
                "Files list is empty"
            );
        }

        return filesList;
    }

    public async getFileInfo(id: number) {
        const file = await this.fileRepository.getFileById(id);

        if (!file) {
            throw new HttpException(
                404,
                "File not found"
            );
        }

        return file;
    }

    public async deleteFile(id: number) {
        const existedFile = await this.fileRepository.getFileById(id);

        if (!existedFile) {
            throw new HttpException(
                404,
                "File not found"
            );
        }

        const deletedFile = await this.fileRepository.deleteFile(id);

        fs.unlinkSync(`uploads/${deletedFile.filename}`);

        return deletedFile;
    }

    public async downloadFile(id: number) {
        const existedFile = await this.fileRepository.getFileById(id);

        if (!existedFile) {
            throw new HttpException(
                404,
                "File not found"
            );
        }

        return existedFile;
    }

    public async updateFile(id: number, actualfileData: File, previousFileData: File) {
        const existedFile = await this.fileRepository.getFileById(id);

        if (!existedFile) {
            throw new HttpException(
                404,
                "File not found"
            );
        }

        fs.unlinkSync(`${DOCUMENTS_UPLOAD_FOLDER}/${previousFileData.filename}`);

        return await this.fileRepository.updateFile(id, actualfileData);
    }
}

export {
    FileService
}