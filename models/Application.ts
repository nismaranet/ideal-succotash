import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  lowonganId: mongoose.Types.ObjectId | string;
  lowonganTitle: string;
  applicant: {
    discordId: string;
    name: string;
    email?: string;
  };
  answers: {
    fieldId: string;
    question: string;
    answer: string | string[];
  }[];
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
  claimedBy?: {
    discordId: string;
    name: string;
  };
  reason?: string;
  discordChannelId?: string;
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    lowonganId: {
      type: Schema.Types.ObjectId,
      ref: "Lowongan",
      required: true,
    },
    lowonganTitle: {
      type: String,
      required: true,
    },
    applicant: {
      discordId: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String },
    },
    answers: [
      {
        fieldId: { type: String, required: true },
        question: { type: String, required: true },
        answer: { type: Schema.Types.Mixed, required: true }, // Bisa string atau array of string
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
    claimedBy: {
      discordId: { type: String },
      name: { type: String },
    },
    reason: { type: String },
    discordChannelId: { type: String },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Application) {
  delete mongoose.models.Application;
}
export const Application: Model<IApplication> = mongoose.model<IApplication>("Application", ApplicationSchema);
