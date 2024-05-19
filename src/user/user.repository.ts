import prisma from "src/config/prisma";

class UserRepository {
    private prisma = prisma;

    public async createUser(email: string, password: string) {
        return await this.prisma.user.create({
            data: {
                email,
                password
            }
        });
    }

    public async getUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    public async getUserById(id: number) {
        return await this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }
}

export {
    UserRepository
}