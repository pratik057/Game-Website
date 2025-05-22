import mongoose from "mongoose";

const previousGameWinnerSchema = new mongoose.Schema({
     winningSide: {
    type: String,
    enum: ["andar", "bahar"],
    required: true,
  },
    playedAt: {
    type: Date,
    default: Date.now,
  }
});
const PreviousGameWinner = mongoose.model("PreviousGameWinner", previousGameWinnerSchema);
export default PreviousGameWinner;
