import mongoose from "mongoose";

const previousGameWinnerSchema = new mongoose.Schema({
     winningSide: {
    type: String,
    enum: ["andar", "bahar"],
    required: true,
  },
  jokerCard: {
    suit: {
      type: String,
      enum: ["hearts", "diamonds", "clubs", "spades"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
    playedAt: {
    type: Date,
    default: Date.now,
  }
});
const PreviousGameWinner = mongoose.model("PreviousGameWinner", previousGameWinnerSchema);
export default PreviousGameWinner;
