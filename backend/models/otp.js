import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    required: true, 
    default: () => Date.now() + 5 * 60 * 1000  // Set expiration time (5 minutes)
  }
});

// Index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
