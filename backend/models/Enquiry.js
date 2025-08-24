import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // guest bhi ho sakta hai
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userMobile: { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
