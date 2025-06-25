import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  
  },
  mobileNo:{
    type: String,
    
    min: 10,
    max: 15,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
  balance: {
    type: Number, // Balance as a number
   
    default:0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  }
,
  betLimit: {
    type: Number,
    default: 10000, // Default bet limit
  },  
resetPasswordToken: String,
resetPasswordExpires: Date,

  isAdmin: { type: Boolean, default: false },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
