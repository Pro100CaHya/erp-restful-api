interface Auth {
    id?: number;
    device: string;
    refreshToken: string;
    isAccessTokenRevoked?: boolean;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export {
    Auth
}