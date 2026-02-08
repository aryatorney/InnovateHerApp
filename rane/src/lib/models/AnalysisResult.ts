import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnalysisResult extends Document {
  entryId: Types.ObjectId;
  userId: string;
  generatedAt: Date;
  modelConfig: {
    modelName: string;
    promptVersion: string;
  };
  weather: {
    primary: string;
    intensity: number;
    descriptors: string[];
  };
  productivity: {
    peakTime: string;
    energyLevel: number;
    focusScore: number;
  };
  rawOutput?: mongoose.Schema.Types.Mixed;
}

const AnalysisResultSchema = new Schema<IAnalysisResult>({
  entryId: { type: Schema.Types.ObjectId, ref: "JournalEntry", required: true },
  userId: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  modelConfig: {
    modelName: { type: String },
    promptVersion: { type: String },
  },
  weather: {
    primary: { type: String },
    intensity: { type: Number },
    descriptors: [{ type: String }],
  },
  productivity: {
    peakTime: { type: String },
    energyLevel: { type: Number },
    focusScore: { type: Number },
  },
  rawOutput: { type: Schema.Types.Mixed },
});

AnalysisResultSchema.index({ entryId: 1, generatedAt: -1 });
AnalysisResultSchema.index({ userId: 1, "weather.primary": 1 });

export const AnalysisResult: Model<IAnalysisResult> =
  mongoose.models.AnalysisResult ||
  mongoose.model<IAnalysisResult>("AnalysisResult", AnalysisResultSchema);
