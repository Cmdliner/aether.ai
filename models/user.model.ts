import {  Model, model, models, Schema } from "mongoose";

export const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    gender: { type: String, enum: ['M', 'F'], required: true },
    dob: { type: Date, required: true},
    nationality: { type: String, required: true},
    job_title: { type: String},
    job_description: { type: String},
    current_residence: { type: String},
    medical_history: {
        allergies: [{ type: String }],
        blood_group: {type: String, enum: []},
        genotype: { type: String, enum: []},
        known_conditions: { type: String, }
    }
});

export const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);