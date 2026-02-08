import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  auth0Id: string;
  email: string;
  createdAt: Date;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  auth0Id: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    notifications: { type: Boolean, default: true },
  },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
