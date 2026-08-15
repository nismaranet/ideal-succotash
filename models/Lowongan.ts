import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConditionRule {
  fieldId: string;
  operator: "equals" | "not_equals" | "contains";
  value: string;
}

export interface IFormFieldCondition {
  logic: "AND" | "OR";
  rules: IConditionRule[];
}

export interface IFormField {
  id: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  label: string;
  required: boolean;
  options?: string[];
  condition?: IFormFieldCondition;
}

export interface ILowongan extends Document {
  title: string;
  slug: string;
  division: string;
  roleType: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  status: "Open" | "Closed" | "Draft";
  postedAt: Date;
  deadline?: Date;
  createdBy: { name: string; discordId: string };
  updatedBy?: { name: string; discordId: string };
  formFields?: IFormField[];
  targetRoleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConditionRuleSchema = new Schema<IConditionRule>({
  fieldId: { type: String, required: true },
  operator: { type: String, required: true, enum: ["equals", "not_equals", "contains"] },
  value: { type: String, required: true },
}, { _id: false });

const FormFieldConditionSchema = new Schema<IFormFieldCondition>({
  logic: { type: String, required: true, enum: ["AND", "OR"], default: "AND" },
  rules: { type: [ConditionRuleSchema], default: [] },
}, { _id: false });

const FormFieldSchema = new Schema<IFormField>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["text", "textarea", "radio", "checkbox", "select"] 
  },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  condition: { type: FormFieldConditionSchema, required: false },
}, { _id: false });

const LowonganSchema = new Schema<ILowongan>(
  {
    title: {
      type: String,
      required: [true, "Judul lowongan wajib diisi"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug wajib diisi"],
      unique: true,
      trim: true,
    },
    division: {
      type: String,
      required: [true, "Divisi wajib diisi"],
    },
    roleType: {
      type: String,
      required: [true, "Tipe peran wajib diisi"],
    },
    description: {
      type: String,
      required: [true, "Deskripsi lowongan wajib diisi"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "Remote", // Mayoritas role komunitas game adalah Remote
    },
    type: {
      type: String,
      default: "Casual",
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Draft",
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    createdBy: {
      name: { type: String, required: true },
      discordId: { type: String, required: true },
    },
    updatedBy: {
      name: { type: String },
      discordId: { type: String },
    },
    formFields: {
      type: [FormFieldSchema],
      default: [],
    },
    targetRoleId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

// Mencegah Mongoose compile ulang model saat Next.js hot-reloading di environment Dev
// Hapus cache model agar field baru (seperti slug) ikut terdaftar saat hot-reload
if (mongoose.models.Lowongan) {
  delete mongoose.models.Lowongan;
}
export const Lowongan: Model<ILowongan> = mongoose.model<ILowongan>("Lowongan", LowonganSchema);
