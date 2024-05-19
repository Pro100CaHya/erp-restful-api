import prisma from "src/config/prisma";

import { Auth } from "./auth.interface";

class AuthRepository {
    private prisma = prisma;

    public async createSession(authData: Auth) {
        return await this.prisma.session.create({
            data: {
                ...authData
            }
        });
    }

    public async getUserSessionByDevice(device: string, userId: number) {
        return await this.prisma.session.findFirst({
            where: {
                device: device,
                userId: userId
            }
        });
    }

    public async getSessionByRefreshToken(refreshToken: string) {
        return await this.prisma.session.findUnique({
            where: {
                refreshToken
            }
        });
    }

    public async deleteSession(id: number) {
        return await this.prisma.session.delete({
            where: {
                id
            }
        });
    }

    public async addAccessTokenIntoBlackList(accessToken: string) {
        return await this.prisma.accessTokenBlackList.create({
            data: {
                accessToken
            }
        });
    }
    
    public async findAccessTokenInBlackList(accessToken: string) {
        return await this.prisma.accessTokenBlackList.findUnique({
            where: {
                accessToken
            }
        });
    }
}

export {
    AuthRepository
}