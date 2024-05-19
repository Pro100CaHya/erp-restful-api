import { Router, Request, Response, NextFunction } from "express";

import { UserService } from "./user.service";

import { Controller, RequestWithUser } from "src/interfaces";
import { checkIsAuthenticated } from "src/middlewares/check-is-authenticated";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(`${this.path}/info`, checkIsAuthenticated, this.getUserInfo);
    }

    private getUserInfo = async (req: RequestWithUser, res: Response) => {
        const userData = req.user;

        res.status(200).json({
            email: userData.email
        });
    }
}

export {
    UserController
}