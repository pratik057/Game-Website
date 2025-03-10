import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
  },
  type: {
    type: String,
    enum: ["bet", "win", "deposit", "withdrawal"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction

