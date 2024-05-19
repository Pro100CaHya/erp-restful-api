import bcrypt from "bcrypt";

import { UserRepository } from "./user.repository";
import { User } from "./user.interface";

import { HttpException } from "src/exceptions";

class UserService {
    private userRepository = new UserRepository();

    public async createUser(email: string, password: string) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        return await this.userRepository.createUser(email, hashedPassword);
    }

    public async getUserByEmail(email: string) {
        return await this.userRepository.getUserByEmail(email);
    }

    public async getUserById(id: number) {
        return await this.userRepository.getUserById(id);
    }
}

export {
    UserService
}