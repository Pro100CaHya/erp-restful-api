interface File {
    id?: number;
    filename: string;
    extension?: string;
    mimeType: string
    size: number;
    uploadedAt?: Date;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export {
    File
}