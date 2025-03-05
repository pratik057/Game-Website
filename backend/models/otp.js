const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: Date.now} // Auto-delete after 5 minutes
});

module.exports = mongoose.model("OTP", otpSchema);
