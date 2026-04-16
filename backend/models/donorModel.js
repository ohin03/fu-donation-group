import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    bloodGroup: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);
