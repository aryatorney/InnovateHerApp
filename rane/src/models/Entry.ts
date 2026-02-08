import mongoose, { Schema, Model } from "mongoose";
import { DayEntry } from "@/lib/types";

// Extends DayEntry but Mongoose documents have _id
export interface IEntry extends DayEntry, mongoose.Document {
    userId?: string;
}

const EntrySchema = new Schema<IEntry>(
    {
        date: { type: String, required: true }, // "YYYY-MM-DD"
        reflection: { type: String, required: true },
        primaryWeather: {
            type: String,
            required: true,
            enum: ["storms", "fog", "low-tide", "gusts", "clear-skies"],
        },
        secondaryWeather: {
            type: String,
            enum: ["storms", "fog", "low-tide", "gusts", "clear-skies"],
        },
        explanation: { type: String, required: true },
        shelterSuggestions: [
            {
                text: { type: String, required: true },
                icon: { type: String, required: true },
            },
        ],
        guardrails: {
            notIdeal: [{ type: String }],
            betterSuited: [{ type: String }],
        },
        closingMessage: { type: String, required: true },
        context: {
            sleepHours: Number,
            activityLevel: String,
            cyclePhase: String,
        },
        // We add a user field to associate with Auth0 user later
        // For now, we'll keep it simple as per request
        userId: { type: String, required: true, index: true },
    },
    { timestamps: true }
);

// Compound unique index to ensure one entry per user per day
EntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Prevent overwriting model during hot reload
const Entry: Model<IEntry> =
    mongoose.models.Entry || mongoose.model<IEntry>("Entry", EntrySchema);

export default Entry;
