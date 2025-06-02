import { Model, model, models, Schema } from "mongoose";

export const OTPSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, expireAfterSeconds: 300 }
}, { timestamps: true });

export const OTP: Model<IOTP> = models.OTP || model<IOTP>("OTP", OTPSchema);