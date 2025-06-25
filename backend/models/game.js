import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  betSide: {
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
  andarCards: [
    {
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
  ],
  baharCards: [
    {
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
  ],
  winningSide: {
    type: String,
    enum: ["andar", "bahar"],
    required: true,
  },
  winningCardIndex: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    enum: ["win", "lose"],
    required: true,
  },
  winAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

})

const Game = mongoose.model("Game", gameSchema)

export default Game;
