import mongoose, { Schema, Model } from "mongoose";

export interface IUserPreferences extends mongoose.Document {
    userId: string;
    cycleTrackingEnabled: boolean;
    lastPeriodStart?: Date;
    cycleLength: number;
    healthDataEnabled: boolean;
    updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
    {
        userId: { type: String, required: true, unique: true, index: true },
        cycleTrackingEnabled: { type: Boolean, default: false },
        lastPeriodStart: { type: Date },
        cycleLength: { type: Number, default: 28, min: 21, max: 40 },
        healthDataEnabled: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const UserPreferences: Model<IUserPreferences> =
    mongoose.models.UserPreferences ||
    mongoose.model<IUserPreferences>("UserPreferences", UserPreferencesSchema);

export default UserPreferences;
