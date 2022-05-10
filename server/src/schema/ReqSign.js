import mongoose from "mongoose";

const reqSignatureSchema = new mongoose.Schema({
  contractAddress: String,
  isComplete: Boolean,
  signature: String,
  amount: Number,
  description: String,
});

export default mongoose.model("signatures", reqSignatureSchema);
