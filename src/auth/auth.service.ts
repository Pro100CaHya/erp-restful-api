import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { HttpException } from "src/exceptions";
import { JwtPayload } from "src/interfaces";

import { AuthRepository } from "./auth.repository";
import { User, UserService } from "src/user";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "src/config/consts";

class AuthService {
    private userService = new UserService();
    private authRepository = new AuthRepository();

    public async signup(userData: User, userAgent: string) {
        const existedUser = await this.userService.getUserByEmail(userData.email);

        if (existedUser) {
            throw new HttpException(400, "User with this email already exists");
        }

        const registeredUser = await this.userService.createUser(userData.email, userData.password);

        const accessToken = this.generateAccessToken({ userId: registeredUser.id, device: userAgent });

        const refreshToken = this.generateRefreshToken({ userId: registeredUser.id, device: userAgent });

        const createdSession = await this.authRepository.createSession({
            userId: registeredUser.id,
            refreshToken,
            device: userAgent
        })

        return {
            accessToken: {
                token: accessToken,
                expiresIn: 600
            },
            refreshToken: {
                token: refreshToken,
                expiresIn: 259200
            }
        };
    }

    public async signin(userData: User, userAgent: string) {
        const existedUser = await this.userService.getUserByEmail(userData.email);

        if (!existedUser) {
            throw new HttpException(401, "Invalid email or password");
        }

        const isPasswordCorrect = bcrypt.compareSync(userData.password, existedUser.password);

        if (!isPasswordCorrect) {
            throw new HttpException(401, "Invalid email or password");
        }

        const accessToken = this.generateAccessToken({ userId: existedUser.id, device: userAgent });

        const refreshToken = this.generateRefreshToken({ userId: existedUser.id, device: userAgent });

        const existedSession = await this.getUserSessionByDevice(userAgent, existedUser.id);

        if (existedSession) {
            await this.authRepository.deleteSession(existedSession.id);
        }

        await this.authRepository.createSession({
            userId: existedUser.id,
            refreshToken,
            device: userAgent
        })

        return {
            accessToken: {
                token: accessToken,
                expiresIn: 600
            },
            refreshToken: {
                token: refreshToken,
                expiresIn: 259200
            }
        };
    }

    public async signinNewToken(refreshToken: string, userAgent: string) {
        const existedSession = await this.authRepository.getSessionByRefreshToken(refreshToken);

        if (existedSession) {
            try {
                const verificationResponse = this.verifyRefreshToken(existedSession.refreshToken) as JwtPayload;

                const userId = verificationResponse.userId;

                const accessToken = this.generateAccessToken({ userId, device: userAgent });

                const refreshToken = this.generateRefreshToken({ userId, device: userAgent });

                await this.authRepository.deleteSession(existedSession.id);

                await this.authRepository.createSession({
                    userId,
                    refreshToken,
                    device: userAgent
                });

                return {
                    accessToken: {
                        token: accessToken,
                        expiresIn: 600
                    },
                    refreshToken: {
                        token: refreshToken,
                        expiresIn: 259200
                    }
                };
            } catch {
                throw new HttpException(401, "Invalid refresh token");
            }
        } else {
            throw new HttpException(401, "Invalid refresh token");
        }
    }

    public async logout(userId: number, userAgent: string, accessToken: string) {
        const existedSession = await this.getUserSessionByDevice(userAgent, userId);

        if (!existedSession) {
            throw new HttpException(401, "You are already logged out");
        }

        await this.authRepository.deleteSession(existedSession.id);

        await this.authRepository.addAccessTokenIntoBlackList(accessToken);

        return;
    }

    public async findAccessTokenInBlackList(accessToken: string) {
        return await this.authRepository.findAccessTokenInBlackList(accessToken);
    }

    public async getUserSessionByDevice(device: string, userId: number) {
        return await this.authRepository.getUserSessionByDevice(device, userId);
    }

    public generateAccessToken(payload: JwtPayload) {
        return jwt.sign(
            payload,
            JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: '10m'
            }
        )
    }

    public generateRefreshToken(payload: JwtPayload) {
        return jwt.sign(
            payload,
            JWT_REFRESH_TOKEN_SECRET,
            {
                expiresIn: '3d'
            }
        )
    }

    public verifyAccessToken(token: string) {
        return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    }

    public verifyRefreshToken(token: string) {
        return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    }
}

export {
    AuthService
}