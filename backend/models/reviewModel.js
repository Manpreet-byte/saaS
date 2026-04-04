import mongoose from "mongoose";

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    userId: { type: String, required: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String },
    aiGeneratedReview: { type: String },
    aiSuggestedReply: { type: String },
    tone: {
      type: String,
      enum: ["professional", "friendly", "apologetic", "enthusiastic"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
