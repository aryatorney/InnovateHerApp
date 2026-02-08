import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJournalEntry extends Document {
  userId: string;
  date: string;
  timestamp: Date;
  content: {
    text: string;
  };
  userTags: string[];
  context: {
    sleepHours?: number;
    activityLevel?: string;
    cyclePhase?: string;
  };
  analysisStatus: "pending" | "complete" | "failed";
  schemaVersion: number;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  content: {
    text: { type: String, required: true, minlength: 1, maxlength: 5000 },
  },
  userTags: [{ type: String }],
  context: {
    sleepHours: { type: Number },
    activityLevel: { type: String },
    cyclePhase: { type: String },
  },
  analysisStatus: {
    type: String,
    enum: ["pending", "complete", "failed"],
    default: "pending",
  },
  schemaVersion: { type: Number, default: 1 },
});

JournalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const JournalEntry: Model<IJournalEntry> =
  mongoose.models.JournalEntry ||
  mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);
