import mongoose from "mongoose";

const reqSignatureSchema = new mongoose.Schema(
  {
    contractAddress: {
      required: true,
      type: String,
    },
    isComplete: {
      required: true,
      type: Boolean,
    },
    signature: String,
    amount: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("signatures", reqSignatureSchema);
