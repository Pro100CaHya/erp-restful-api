import App from "src/app";
import { UserController } from "src/user";
import { AuthController } from "src/auth";
import { FileController } from "./file/file.controller";

const app = new App([
    new UserController(),
    new AuthController(),
    new FileController()
]);

app.startServer();