import { Document, Model, model, models, Schema } from "mongoose";



export const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String },
    role: { type: String, enum: ['student'], }
});

export const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);