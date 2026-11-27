import mongoose from "mongoose";
import { Category } from "../types/category.type.js";

const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      minLength: [5, "Name cannot be less than 5 characters"],
      maxLength: [128, "Name cannot exceed more than 128 characters"],
    },

    description: {
      type: String,
      trim: true,
      minLength: [25, "Description cannot be less than 25 characters"],
      maxLength: [600, "Description cannot exceed more than 600 characters"],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

export const categoryModel = mongoose.model<Category>(
  "Category",
  categorySchema,
);
