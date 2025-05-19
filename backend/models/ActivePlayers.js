// models/ActivePlayer.js
import mongoose from "mongoose"

const activePlayerSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("ActivePlayer", activePlayerSchema)
