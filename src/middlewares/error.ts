import { NextFunction, Request, Response } from "express";
import { HttpException } from "src/exceptions";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    console.log(error.stack);
    
    response
        .status(statusCode)
        .json({
            statusCode,
            message
        });
}

export {
    errorMiddleware
}