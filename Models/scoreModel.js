// models/scoreModel.js
import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

export default mongoose.model("Score", scoreSchema);
