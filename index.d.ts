import { Document } from 'mongoose';

declare global {
    interface IUser extends Document {
        email: string;
        password: string;
        username: string;
        role: string;
    }

    type SessionPayload = {
        sub: string;
        expiresAt: Date;
    }
}

// This export {} is needed to make TypeScript treat this file as a module
export {}