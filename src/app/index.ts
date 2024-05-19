import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

import { Controller } from "src/interfaces";
import { errorMiddleware } from "src/middlewares/error";
import { setCorsHeaders } from "src/middlewares";

class App {
    private readonly app: express.Application;
    private readonly port: number;

    constructor(controllers: Controller[], port: number = 5000) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(setCorsHeaders);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use("/api", controller.router);
        });
    }

    public async startServer() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port: ${this.port}`);
        });
    }
}

export default App;