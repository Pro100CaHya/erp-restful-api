import { Request } from "express";
import { User } from "src/user";

interface RequestWithUser extends Request {
    user: User
}

export {
    RequestWithUser
}