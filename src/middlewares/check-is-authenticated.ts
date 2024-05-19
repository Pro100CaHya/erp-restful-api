import { Response, NextFunction } from "express";

import { HttpException } from "../exceptions";
import { JwtPayload, RequestWithUser } from "src/interfaces";
import { UserService } from "src/user";
import { AuthService } from "src/auth";

async function checkIsAuthenticated(request: RequestWithUser, response: Response, next: NextFunction) {
    const userService = new UserService();
    const authService = new AuthService();

    const { authorization, "user-agent": userAgent } = request.headers;

    const accessToken = authorization?.split(" ");

    if (accessToken && accessToken[1]) {
        try {
            const verificationResponse = authService.verifyAccessToken(accessToken[1]) as JwtPayload;

            const id = verificationResponse.userId;

            const blackListToken = await authService.findAccessTokenInBlackList(accessToken[1]);

            if (blackListToken) {
                next(
                    new HttpException(
                        401,
                        "Unauthorized"
                    )
                );
            }

            const { device: foundDevice } = await authService.getUserSessionByDevice(request.headers["user-agent"], id);

            if (userAgent !== foundDevice) {
                next(
                    new HttpException(
                        401,
                        "Unauthorized"
                    )
                );
            }

            const user = await userService.getUserById(id);

            if (user) {
                request.user = user;
                next();
            } else {
                next(
                    new HttpException(
                        401,
                        "Wrong authentication token"
                    )
                )
            }
        } catch (error) {
            next(
                new HttpException(
                    401,
                    "Wrong authentication token"
                )
            );
        }
    } else {
        next(
            new HttpException(
                401,
                "Unauthorized"
            )
        );
    }
}

export {
    checkIsAuthenticated
}