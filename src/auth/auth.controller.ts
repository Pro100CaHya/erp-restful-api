import { Router, Request, Response, NextFunction } from "express";

import { AuthService } from "./auth.service";
import { checkIsAuthenticated } from "src/middlewares";
import { Controller, RequestWithUser } from "src/interfaces";
import { User } from "src/user";

class AuthController implements Controller {
    public path = "/auth";
    public router = Router();
    private authService = new AuthService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}/signup`, this.signup);
        this.router.post(`${this.path}/signin`, this.signin);
        this.router.post(`${this.path}/signin/new`, this.signinNewToken);
        this.router.get(`${this.path}/logout`, checkIsAuthenticated, this.logout);
    }

    private signup = async (req: Request, res: Response, next: NextFunction) => {
        const userData: User = req.body;
        const userAgent = req.get('User-Agent');

        try {
            const tokens = await this.authService.signup(userData, userAgent);

            res.status(201).json(tokens);
        } catch (error) {
            next(error);
        }
    }

    private signin = async (req: Request, res: Response, next: NextFunction) => {
        const userData: User = req.body;
        const userAgent = req.get('User-Agent');

        try {
            const tokens = await this.authService.signin(userData, userAgent);

            res.status(200).json(tokens);
        } catch (error) {
            next(error);
        }
    }

    private signinNewToken = async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.body;
        const userAgent = req.get('User-Agent');

        try {
            const tokens = await this.authService.signinNewToken(refreshToken, userAgent);

            res.status(200).json(tokens);
        } catch (error) {
            next(error);
        }
    }

    private logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { id } = req.user;
        const userAgent = req.get('User-Agent');
        const accessToken = req.headers.authorization?.split(" ")[1];

        try {
            const logoutResult = await this.authService.logout(id, userAgent, accessToken);

            res.status(200).json({
                message: "Logout successful",
            });
        } catch (error) {
            next(error);
        }
    }
}

export {
   AuthController
}