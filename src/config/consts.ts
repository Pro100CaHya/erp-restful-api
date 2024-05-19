import "dotenv/config";

const {
    DATABASE_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    UPLOAD_FOLDER,
    PORT
} = process.env

const DOCUMENTS_UPLOAD_FOLDER = `${process.cwd()}/${UPLOAD_FOLDER}`

export {
    DATABASE_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    DOCUMENTS_UPLOAD_FOLDER,
    PORT
}