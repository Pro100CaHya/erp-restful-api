import { RequestWithUser } from "./request-with-user";
import { File } from "src/file";

interface RequestWithUserAndFile extends RequestWithUser {
    fileData: File
}

export {
    RequestWithUserAndFile
}