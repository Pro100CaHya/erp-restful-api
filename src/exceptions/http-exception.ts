class HttpException extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number = 500, message: string = "Internal Server Error") {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export {
    HttpException
}