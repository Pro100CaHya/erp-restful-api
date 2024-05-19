import prisma from "src/config/prisma";

class FileRepository {
    private prisma = prisma;

    public async createFile(fileData: any) {
        return await this.prisma.file.create({
            data: {
                ...fileData
            }
        });
    }

    public async getFilesList(page: number, listSize: number) {
        return await this.prisma.file.findMany({
            skip: (page - 1) * listSize,
            take: listSize
        });
    }

    public async getFileById(id: number) {
        return await this.prisma.file.findUnique({
            where: {
                id
            }
        });
    }

    public async deleteFile(id: number) {
        return await this.prisma.file.delete({
            where: {
                id
            }
        });
    }

    public async updateFile(id: number, fileData: any) {
        return await this.prisma.file.update({
            where: {
                id
            },
            data: {
                ...fileData
            }
        });
    }
}

export {
    FileRepository
}